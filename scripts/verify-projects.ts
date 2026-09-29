/**
 * Checks that every project and every image behind it is actually usable.
 *
 * Run with: pnpm verify:projects
 *
 * Written after an import put three undecodable HEICs into S3 and pointed a
 * project's card image at one of them. Configuration said they would be WebP;
 * they were not. This asks the database and the bucket instead of the config.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

let problems = 0
const fail = (msg: string) => {
  console.log(`  FAIL  ${msg}`)
  problems++
}

const { docs: media, totalDocs: mediaCount } = await payload.find({
  collection: 'media',
  limit: 1000,
  depth: 0,
})

console.log(`\n  ${mediaCount} media documents`)

for (const m of media) {
  const name = String(m.filename ?? '(no filename)')
  if (m.mimeType !== 'image/webp') fail(`${name} is ${m.mimeType}, not image/webp`)
  if (!name.endsWith('.webp')) fail(`${name} does not end in .webp`)
  // Without a thumbnail the sharp pipeline did not run, which is the tell that
  // the original went through untouched.
  if (!m.sizes?.thumbnail?.filename) fail(`${name} has no thumbnail — it was never processed`)
  if (!m.alt) fail(`${name} has no alt text`)
}

const { docs: projects, totalDocs: projectCount } = await payload.find({
  collection: 'projects',
  limit: 200,
  depth: 1,
  sort: 'order',
})

console.log(`  ${projectCount} projects\n`)

for (const p of projects) {
  const card = p.image as { filename?: string; mimeType?: string; url?: string } | null
  const gallery = (Array.isArray(p.gallery) ? p.gallery : []) as { mimeType?: string }[]

  if (!card) {
    fail(`${p.title} has no card image`)
    continue
  }
  if (card.mimeType !== 'image/webp') fail(`${p.title} card image is ${card.mimeType}`)

  const badGallery = gallery.filter((g) => g.mimeType !== 'image/webp').length
  if (badGallery) fail(`${p.title} has ${badGallery} non-WebP gallery images`)

  // The record can be perfect and the object still missing from the bucket.
  let served = ''
  if (card.url) {
    const res = await fetch(card.url, { method: 'HEAD' })
    served = `${res.status} ${res.headers.get('content-type') ?? ''}`
    if (!res.ok) fail(`${p.title} card image is not reachable in S3 (${res.status})`)
    if (res.headers.get('content-type') !== 'image/webp') {
      fail(`${p.title} card image is served as ${res.headers.get('content-type')}`)
    }
  }

  console.log(
    `    ${String(p.order).padStart(3)}  ${String(p.title).padEnd(22)} ` +
      `${String(p.location ?? '').padEnd(24)} ${String(gallery.length + 1).padStart(3)} images  ${served}`,
  )
}

console.log(problems === 0 ? '\n  OK — no problems found\n' : `\n  ${problems} problem(s)\n`)
process.exit(problems === 0 ? 0 : 1)
