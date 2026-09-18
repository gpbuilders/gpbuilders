/**
 * Uploads the hero images committed in public/ into the media library and
 * points the Hero Images global at them.
 *
 * Run with: pnpm seed:hero
 *
 * Idempotent — reuses a Media document if one already exists for the same file,
 * and leaves any field that is already set alone, so re-running it never
 * overwrites the client's own uploads.
 */
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const HOME_SLIDES: [file: string, alt: string][] = [
  ['/interior-hallway.jpg', 'Modern interior hallway with terracotta'],
  ['/project-living-room.png', 'Luxury living room design'],
  ['/exterior-render.jpg', 'Exterior architectural rendering'],
  ['/project-kitchen.png', 'Modern kitchen design'],
  ['/commercial-restaurant.jpg', 'Commercial restaurant design'],
]
const PAGE_ART: [string, string] = ['/architecture-line-art.png', 'Architecture sketch']
const ABOUT_SKETCH: [string, string] = ['/architecture-sketch.png', 'Architectural building sketch']

const payload = await getPayload({ config })
const cache = new Map<string, number>()

async function uploadMedia(publicPath: string, alt: string): Promise<number> {
  const cached = cache.get(publicPath)
  if (cached) return cached

  const filename = path.basename(publicPath)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id
    cache.set(publicPath, id)
    console.log(`  reused    ${filename}`)
    return id
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(ROOT, 'public', publicPath.replace(/^\//, '')),
  })

  cache.set(publicPath, created.id)
  console.log(`  uploaded  ${filename}`)
  return created.id
}

const current = await payload.findGlobal({ slug: 'hero-media', depth: 0 })

const data: Record<string, unknown> = {}

if ((current.homeSlides ?? []).length === 0) {
  console.log('home slideshow')
  const slides = []
  for (const [file, alt] of HOME_SLIDES) {
    slides.push({ image: await uploadMedia(file, alt) })
  }
  data.homeSlides = slides
} else {
  console.log('home slideshow — already set, left alone')
}

if (!current.pageHeroArt) {
  console.log('projects & services artwork')
  data.pageHeroArt = await uploadMedia(...PAGE_ART)
} else {
  console.log('projects & services artwork — already set, left alone')
}

if (!current.aboutSketch) {
  console.log('about sketch')
  data.aboutSketch = await uploadMedia(...ABOUT_SKETCH)
} else {
  console.log('about sketch — already set, left alone')
}

if (Object.keys(data).length === 0) {
  console.log('\nNothing to do — every field is already set.')
} else {
  await payload.updateGlobal({ slug: 'hero-media', data: data as never })
  console.log(`\nDone. Set: ${Object.keys(data).join(', ')}.`)
}

process.exit(0)
