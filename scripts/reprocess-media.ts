/**
 * Brings existing uploads in line with the current Media config.
 *
 * Run with: pnpm reprocess:media          (add --apply to write; dry by default)
 *
 * Payload generates derived sizes at upload time and does not revisit them, so
 * changing `imageSizes` only affects future uploads. This regenerates the
 * thumbnail as WebP, repoints the database at it, and removes the `card` and
 * `hero` objects that are no longer produced — they were uploaded on every
 * upload and never requested, because nothing reads media.sizes.
 *
 * Idempotent: a record whose thumbnail is already WebP is left alone.
 */
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import sharp from 'sharp'
import pg from 'pg'

const APPLY = process.argv.includes('--apply')

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
) as Record<string, string>

const s3 = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
})
const BUCKET = env.S3_BUCKET
const PUBLIC = (env.S3_PUBLIC_URL || '').replace(/\/$/, '')

const ca = env.DATABASE_CA_CERT ? readFileSync(env.DATABASE_CA_CERT, 'utf8') : undefined
const db = new pg.Client({
  connectionString: env.DATABASE_URI,
  ssl: ca ? { ca } : { rejectUnauthorized: false },
})

const buffer = async (key: string): Promise<Buffer> => {
  const r = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
  const chunks: Buffer[] = []
  for await (const c of r.Body as AsyncIterable<Buffer>) chunks.push(c)
  return Buffer.concat(chunks)
}

await db.connect()

const { rows } = await db.query(
  `select id, filename, sizes_thumbnail_filename, sizes_card_filename, sizes_hero_filename
   from media order by id`,
)

const toDelete: string[] = []
let converted = 0
let skipped = 0

for (const row of rows) {
  const master: string = row.filename
  const base = master.replace(/\.[^.]+$/, '')
  const existing: string | null = row.sizes_thumbnail_filename

  // Old card/hero objects are no longer generated, so they are orphans.
  for (const f of [row.sizes_card_filename, row.sizes_hero_filename]) {
    if (f) toDelete.push(f)
  }

  if (existing && existing.endsWith('.webp')) {
    skipped++
    continue
  }

  const thumbName = `${base}-400x300.webp`
  console.log(`  ${master}`)
  console.log(`    thumbnail ${existing ?? '(none)'} -> ${thumbName}`)

  if (APPLY) {
    const src = await buffer(master)
    const out = await sharp(src)
      .resize({ width: 400, height: 300, fit: 'cover', position: 'centre' })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true })

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: thumbName,
        Body: out.data,
        ContentType: 'image/webp',
      }),
    )

    await db.query(
      `update media set
         sizes_thumbnail_filename = $1,
         sizes_thumbnail_url = $2,
         sizes_thumbnail_mime_type = 'image/webp',
         sizes_thumbnail_filesize = $3,
         sizes_thumbnail_width = $4,
         sizes_thumbnail_height = $5,
         sizes_card_filename = null, sizes_card_url = null, sizes_card_mime_type = null,
         sizes_card_filesize = null, sizes_card_width = null, sizes_card_height = null,
         sizes_hero_filename = null, sizes_hero_url = null, sizes_hero_mime_type = null,
         sizes_hero_filesize = null, sizes_hero_width = null, sizes_hero_height = null
       where id = $6`,
      [thumbName, `${PUBLIC}/${thumbName}`, out.info.size, out.info.width, out.info.height, row.id],
    )
  }

  if (existing) toDelete.push(existing)
  converted++
}

console.log(
  `\n  ${converted} to convert, ${skipped} already WebP, ${toDelete.length} orphaned objects to remove`,
)

if (APPLY && toDelete.length) {
  for (let i = 0; i < toDelete.length; i += 1000) {
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: toDelete.slice(i, i + 1000).map((Key) => ({ Key })) },
      }),
    )
  }
  console.log(`  removed ${toDelete.length} objects from ${BUCKET}`)
}

if (!APPLY) console.log('\n  DRY RUN — nothing written. Re-run with --apply.')

await db.end()
process.exit(0)
