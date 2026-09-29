/**
 * Bulk-imports a folder of project photographs into the `projects` collection.
 *
 * Run with: pnpm import:projects -- "/path/to/Full projects"          (dry)
 *           pnpm import:projects -- "/path/to/Full projects" --apply  (writes)
 *
 * Dry by default, like scripts/reprocess-media.ts. The first version of this
 * took --dry to opt *out* of writing, and pnpm swallowed the flag on its way
 * through, so a run meant as a rehearsal uploaded eighty-eight images. Writing
 * is now the thing you have to ask for.
 *
 * One sub-folder becomes one project: the folder name is the title, and every
 * image inside becomes a Media document whose alt text is the file name.
 *
 * Both environment variables in the npm script matter, for different reasons:
 *
 *   NODE_ENV=production      turns OFF drizzle `push`. Outside production the
 *                            adapter pushes schema, and a push that finds any
 *                            drift stops for a (y/N) no script can answer.
 *   PAYLOAD_MIGRATING=true   selects DATABASE_URI_DIRECT, the session-mode
 *                            connection on 5432. Encoding a 20MB photograph
 *                            and putting it to S3 leaves the Postgres
 *                            connection idle for seconds at a time, and
 *                            Supavisor's transaction pooler on 6543 evicts it
 *                            — the next query then dies with ETIMEDOUT, twice
 *                            observed mid-import. Session mode holds the
 *                            connection for the life of the process.
 *
 * Together they give a long-lived connection with no schema push.
 *
 * Idempotent, because 200 uploads over a link to Sydney is not something you
 * want to restart from zero: a project whose title already exists is skipped,
 * and a media file whose stored name already exists is reused.
 */
import { execFileSync } from 'child_process'
import { mkdtempSync, readdirSync, rmSync, statSync } from 'fs'
import os from 'os'
import path from 'path'

import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import type { Project } from '../payload-types'

const args = process.argv.slice(2)
const SOURCE = args.find((a) => !a.startsWith('--'))
const APPLY = args.includes('--apply')
const SCOPE_ARG = args.find((a) => a.startsWith('--scope='))?.slice('--scope='.length)
const ONGOING = args.includes('--ongoing')

if (!SOURCE) {
  console.error(
    'Usage: tsx scripts/import-projects.ts "/path/to/folder" ' +
      '[--scope="Interior Design"] [--ongoing] [--apply]',
  )
  process.exit(1)
}

/** Payload's mimeTypes is image/*; these are the ones sharp can actually read. */
const IMAGE = /\.(jpe?g|png|webp|gif|heic|heif|avif|tiff?)$/i

/**
 * Payload hands the file to sharp only for formats it recognises. A HEIC goes
 * through untouched — no resize, no WebP, no thumbnail — and lands in S3 as a
 * file most browsers refuse to display. So anything outside this set is
 * decoded to PNG first and then follows the normal path: resize to 2560,
 * re-encode to WebP. Lossless in, one lossy step out.
 */
const PAYLOAD_HANDLES = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])

/**
 * Must be one of the options on the collection, which are a Postgres enum —
 * a value that is not in it fails at insert rather than being coerced, so it
 * is checked here where the error can say something useful.
 */
const SCOPES: Project['scope'][] = [
  'Architecture',
  'Interior Design',
  'Construction',
  'Architecture + Interior + Construction',
  'Architecture + Construction',
  'Interior Design + Construction',
  'Landscape + Construction',
]

const SCOPE = (SCOPE_ARG ?? 'Architecture + Interior + Construction') as Project['scope']
if (!SCOPES.includes(SCOPE)) {
  console.error(`Unknown scope ${JSON.stringify(SCOPE)}. One of:\n  ${SCOPES.join('\n  ')}`)
  process.exit(1)
}

const CATEGORY: Project['category'] = 'residential'

/**
 * Locations are placeholders, as asked. Real towns in the firm's own district
 * rather than random strings, so the projects page reads plausibly until
 * someone puts the true addresses in.
 */
const LOCATIONS = [
  'Srirangam, Trichy',
  'Thillai Nagar, Trichy',
  'Karumandapam, Trichy',
  'Woraiyur, Trichy',
  'Thiruverumbur, Trichy',
  'K K Nagar, Trichy',
  'Cantonment, Trichy',
  'Manikandam, Trichy',
  'Somarasampettai, Trichy',
]

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type Candidate = {
  file: string
  abs: string
  ext: string
  landscape: boolean
  /** Set for formats Payload cannot process: a PNG rendered from the original. */
  decoded?: string
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'import-projects-'))

/**
 * Renders anything Payload will not process into a PNG.
 *
 * sharp is tried first, but this build reads HEIC containers without being
 * able to decode them — metadata succeeds and the pixels fail, which is how
 * three unconverted HEICs reached S3. macOS ships sips, which decodes them
 * properly and applies the container's rotation while it is at it.
 */
function decodeToPng(abs: string, stem: string): string {
  const out = path.join(tmp, `${stem}.png`)
  try {
    execFileSync('sips', ['-s', 'format', 'png', abs, '--out', out], { stdio: 'pipe' })
    return out
  } catch (error) {
    throw new Error(
      `Could not decode ${path.basename(abs)}: ${(error as Error).message.slice(0, 120)}`,
    )
  }
}

/** Read the folders before connecting to anything, so a dry run costs nothing. */
async function survey(dir: string) {
  const folders = readdirSync(dir)
    .filter((f) => !f.startsWith('.') && statSync(path.join(dir, f)).isDirectory())
    .sort()

  const plan: { title: string; images: Candidate[]; ignored: string[] }[] = []

  for (const folder of folders) {
    const full = path.join(dir, folder)
    const images: Candidate[] = []
    const ignored: string[] = []

    // Walks subfolders too. Reading only the top level quietly skipped two
    // photographs filed one directory deeper, and nothing said so — the
    // folder simply reported fewer images than it held.
    const walk = (dir: string): string[] =>
      readdirSync(dir)
        .filter((f) => !f.startsWith('.'))
        .sort()
        .flatMap((f) => {
          const abs = path.join(dir, f)
          return statSync(abs).isDirectory() ? walk(abs) : [abs]
        })

    for (const abs of walk(full)) {
      const file = path.basename(abs)
      if (!IMAGE.test(file)) {
        ignored.push(file)
        continue
      }
      const ext = path.extname(file).slice(1).toLowerCase()
      try {
        // Exotic formats are decoded once, here, and the PNG is what gets both
        // measured and uploaded. Measuring the original is not safe: HEIC
        // carries its rotation in the container rather than in EXIF, so sharp
        // reports these portrait when they are in fact landscape.
        const decoded = PAYLOAD_HANDLES.has(ext)
          ? undefined
          : decodeToPng(abs, `${slug(folder)}-${slug(file.replace(/\.[^.]+$/, ''))}`)

        const m = await sharp(decoded ?? abs).metadata()
        const rotated = !decoded && (m.orientation ?? 1) >= 5
        const width = (rotated ? m.height : m.width) ?? 0
        const height = (rotated ? m.width : m.height) ?? 0

        images.push({ file, abs, ext, landscape: width >= height, decoded })
      } catch (error) {
        ignored.push(`${file} (unreadable: ${(error as Error).message.slice(0, 60)})`)
      }
    }

    plan.push({ title: folder, images, ignored })
  }

  return plan
}

const plan = await survey(SOURCE)

console.log(`\nSource: ${SOURCE}`)
console.log(`Scope:  ${SCOPE}${ONGOING ? '   (marked ongoing)' : ''}\n`)
for (const p of plan) {
  const land = p.images.filter((i) => i.landscape).length
  const decode = p.images.filter((i) => !PAYLOAD_HANDLES.has(i.ext)).length
  console.log(
    `  ${p.title.padEnd(22)} ${String(p.images.length).padStart(3)} images` +
      ` (${land} landscape${decode ? `, ${decode} need decoding first` : ''})` +
      `${p.ignored.length ? `  ignored: ${p.ignored.join(', ')}` : ''}` +
      `${p.images.length === 0 ? '  <- SKIPPED, no usable image' : ''}`,
  )
}

const usable = plan.filter((p) => p.images.length > 0)
console.log(
  `\n  ${usable.length} projects, ${usable.reduce((n, p) => n + p.images.length, 0)} images\n`,
)

if (!APPLY) {
  console.log('  DRY RUN — nothing written. Re-run with --apply.\n')
  process.exit(0)
}

// Opened only now. Booting Payload first and then surveying leaves the
// connection idle long enough for Supavisor to drop it, and the first query
// then dies with ETIMEDOUT.
const payload = await getPayload({ config })

const { docs: last } = await payload.find({ collection: 'projects', sort: '-order', limit: 1 })
let order = (last[0]?.order ?? 0) + 1

let createdProjects = 0
let uploaded = 0
let reused = 0
let decoded = 0

for (const project of usable) {
  const existing = await payload.find({
    collection: 'projects',
    where: { title: { equals: project.title } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`skip    ${project.title} (already exists)`)
    continue
  }

  // File names repeat across folders (IMG_1181.HEIC appears more than once),
  // so the stored name carries the project. Without this the reuse check below
  // would hand one project's photograph to another.
  const prefix = slug(project.title)

  const upload = async (c: Candidate): Promise<number> => {
    const base = c.file.replace(/\.[^.]+$/, '')
    const stem = `${prefix}-${slug(base)}`

    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: `${stem}.webp` } },
      limit: 1,
    })
    if (found.docs.length > 0) {
      reused++
      return found.docs[0].id
    }

    // Every file is normalised here rather than handed over as it came off
    // the camera. These average 20MB and run to 35MB, and giving Payload one
    // of those meant sharp and the S3 PUT ran long enough inside the create to
    // pass Postgres' 2-minute statement_timeout — the import died on the same
    // file twice. Downscaling first makes that work small and predictable.
    //
    // PNG because it is lossless: Payload re-encodes to WebP after this, so
    // the picture is compressed exactly once on the way to the bucket.
    if (c.decoded) decoded++
    const data = await sharp(c.decoded ?? c.abs)
      .rotate()
      .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()
    const name = `${stem}.png`
    const mimetype = 'image/png'

    const doc = await payload.create({
      collection: 'media',
      // As asked: the file name is the alt text.
      data: { alt: base },
      file: { data, name, mimetype, size: data.byteLength },
    })

    // The whole point of the pre-decode above. If anything still slips through
    // unconverted, stop rather than quietly publish a file browsers cannot
    // open — which is exactly how three HEICs reached the site.
    if (doc.mimeType !== 'image/webp' || !String(doc.filename).endsWith('.webp')) {
      throw new Error(
        `${c.file} stored as ${doc.filename} (${doc.mimeType}) — expected WebP. Aborting.`,
      )
    }

    uploaded++
    return doc.id
  }

  const card = project.images.find((i) => i.landscape) ?? project.images[0]
  const rest = project.images.filter((i) => i.abs !== card.abs)

  console.log(`create  ${project.title}  (${project.images.length} images, card: ${card.file})`)

  const image = await upload(card)
  const gallery: number[] = []
  for (const [i, c] of rest.entries()) {
    gallery.push(await upload(c))
    if ((i + 1) % 10 === 0) console.log(`          ${i + 1}/${rest.length} gallery images`)
  }

  await payload.create({
    collection: 'projects',
    data: {
      title: project.title,
      location: LOCATIONS[createdProjects % LOCATIONS.length],
      category: CATEGORY,
      scope: SCOPE,
      image,
      gallery,
      ongoing: ONGOING,
      featured: false,
      order: order++,
    },
  })

  createdProjects++
  console.log(`        done — ${uploaded} uploaded, ${reused} reused, ${decoded} decoded so far`)
}

rmSync(tmp, { recursive: true, force: true })

console.log(
  `\ndone — ${createdProjects} projects, ${uploaded} images uploaded ` +
    `(${decoded} decoded before upload), ${reused} reused\n`,
)
process.exit(0)
