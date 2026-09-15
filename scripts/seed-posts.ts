/**
 * Seeds the `posts` collection with the sample articles that used to be
 * hardcoded in components/full-blog-resources.tsx, with real bodies written
 * for them.
 *
 * Run with: pnpm seed:posts
 *
 * Idempotent — it skips any post whose slug already exists, and reuses a Media
 * document if one was already uploaded for the same source file. Edit or delete
 * these in the admin once there is real editorial to replace them with.
 */
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import config from '@payload-config'
import { getPayload } from 'payload'

import type { Post } from '../payload-types'

/** A paragraph, a heading, or a bulleted list — the three shapes used below. */
type Block = { p: string } | { h2: string } | { ul: string[] }

type SeedPost = {
  title: string
  slug: string
  excerpt: string
  category: Post['category']
  featured: boolean
  publishedAt: string
  image: string
  body: Block[]
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seedData: SeedPost[] = JSON.parse(
  readFileSync(path.join(ROOT, 'scripts/seed-data/posts.json'), 'utf8'),
)

const payload = await getPayload({ config })

// Cache uploads so an image shared by two posts only becomes one Media doc.
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

/* Lexical node builders. The editor stores a specific shape and will not
   round-trip anything looser, so these spell it out rather than casting. */

const text = (value: string) => ({
  type: 'text',
  text: value,
  version: 1,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
})

const paragraph = (value: string) => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  children: [text(value)],
})

const heading = (value: string) => ({
  type: 'heading',
  tag: 'h2',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [text(value)],
})

const list = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: items.map((item, index) => ({
    type: 'listitem',
    value: index + 1,
    checked: undefined,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: [text(item)],
  })),
})

function toLexical(blocks: Block[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: blocks.map((block) => {
        if ('h2' in block) return heading(block.h2)
        if ('ul' in block) return list(block.ul)
        return paragraph(block.p)
      }),
    },
  }
}

let created = 0
let skipped = 0

for (const post of seedData) {
  const existing = await payload.find({
    collection: 'posts',
    where: { slug: { equals: post.slug } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`skip   ${post.title} (already exists)`)
    skipped++
    continue
  }

  console.log(`create ${post.title}`)

  const coverImage = await uploadMedia(post.image, post.title)

  await payload.create({
    collection: 'posts',
    data: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      featured: post.featured,
      coverImage,
      content: toLexical(post.body),
      // Midday, so the date reads the same either side of the IST boundary.
      publishedAt: new Date(`${post.publishedAt}T12:00:00+05:30`).toISOString(),
      author: 'GP Builders',
      _status: 'published',
    } as never,
  })

  created++
}

console.log(`\nDone. ${created} created, ${skipped} skipped.`)
process.exit(0)
