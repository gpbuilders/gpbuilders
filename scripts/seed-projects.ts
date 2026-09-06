/**
 * One-off migration of the projects that used to be hardcoded in
 * components/projects.tsx into the Payload `projects` collection.
 *
 * Run with: pnpm seed:projects
 *
 * Idempotent — it skips any project whose title already exists, and reuses a
 * Media document if one was already uploaded for the same source file.
 */
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import type { Project } from '../payload-types'

type SeedProject = {
  title: string
  location: string
  scope: Project['scope']
  category: Project['category']
  image: string
  description?: string
  gallery?: string[]
  featured: boolean
  order: number
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seedData: SeedProject[] = JSON.parse(
  readFileSync(path.join(ROOT, 'scripts/seed-data/projects.json'), 'utf8'),
)

const payload = await getPayload({ config })

// Cache uploads so a file shared by several projects only becomes one Media doc.
const mediaCache = new Map<string, number>()

async function uploadMedia(publicPath: string, alt: string): Promise<number> {
  const cached = mediaCache.get(publicPath)
  if (cached) {
    return cached
  }

  const filename = path.basename(publicPath)

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id
    mediaCache.set(publicPath, id)
    console.log(`  reused media  ${filename}`)
    return id
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(ROOT, 'public', publicPath.replace(/^\//, '')),
  })

  mediaCache.set(publicPath, created.id)
  console.log(`  uploaded      ${filename}`)
  return created.id
}

let created = 0
let skipped = 0

for (const project of seedData) {
  const existing = await payload.find({
    collection: 'projects',
    where: { title: { equals: project.title } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`skip   ${project.title} (already exists)`)
    skipped++
    continue
  }

  console.log(`create ${project.title}`)

  const image = await uploadMedia(project.image, `${project.title} — ${project.scope}`)

  // The card image often repeats as the first gallery entry; drop it so the
  // modal does not open on a duplicate.
  const galleryPaths = (project.gallery ?? []).filter((p) => p !== project.image)

  // gallery is a hasMany upload field, so it holds media IDs directly.
  const gallery: number[] = []
  for (const [i, galleryPath] of galleryPaths.entries()) {
    gallery.push(await uploadMedia(galleryPath, `${project.title} — image ${i + 2}`))
  }

  await payload.create({
    collection: 'projects',
    data: {
      title: project.title,
      location: project.location,
      category: project.category,
      scope: project.scope,
      description: project.description,
      image,
      gallery,
      featured: project.featured,
      order: project.order,
    },
  })

  created++
}

console.log(`\ndone — ${created} created, ${skipped} skipped`)
process.exit(0)
