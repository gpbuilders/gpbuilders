import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** The fixed pages, in rough order of how much they matter. */
const STATIC_ROUTES: [path: string, priority: number, freq: 'weekly' | 'monthly'][] = [
  ['', 1, 'weekly'],
  ['/projects', 0.9, 'weekly'],
  ['/services', 0.8, 'monthly'],
  ['/about', 0.7, 'monthly'],
  ['/resources', 0.7, 'weekly'],
  ['/contact', 0.6, 'monthly'],
]

/**
 * Served at /sitemap.xml.
 *
 * Blog posts are listed from the database rather than hardcoded, so publishing
 * an article makes it discoverable without anyone remembering to edit a list.
 * A failure to read them must not take the whole sitemap down — the static
 * routes are the ones that matter most, and half a sitemap beats a 500.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ([path, priority, changeFrequency]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  )

  try {
    const payload = await getPayload({ config })
    // overrideAccess: false applies the collection's read rule, so drafts stay
    // out of the sitemap — submitting an unpublished URL to Google is worse
    // than omitting it.
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 500,
      sort: '-publishedAt',
      overrideAccess: false,
      select: { slug: true, updatedAt: true, publishedAt: true },
    })

    const postEntries: MetadataRoute.Sitemap = docs.flatMap((post) =>
      post.slug
        ? [
            {
              url: `${SITE_URL}/resources/${post.slug}`,
              lastModified: new Date(post.updatedAt ?? post.publishedAt ?? now),
              changeFrequency: 'yearly' as const,
              priority: 0.6,
            },
          ]
        : [],
    )

    return [...staticEntries, ...postEntries]
  } catch (error) {
    console.error('[sitemap] could not list posts:', error)
    return staticEntries
  }
}
