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
  // Low priority but genuinely wanted in the index: these are pages people
  // search for by name, and a search result is often how they are reached.
  ['/privacy-policy', 0.3, 'monthly'],
  ['/terms', 0.3, 'monthly'],
]

// Stated here rather than inherited from the frontend layout: a metadata route
// is generated on its own, not rendered inside that layout, so the cascade is
// not something to rely on. Without it the post list is frozen at build time.
//
// Dynamic rather than on an interval, for the same reason as the pages: a
// prerendered sitemap ships in the deployment bundle and a container that
// starts from it serves a post list from the last deploy. Submitting a stale
// sitemap is worse than the one query this costs, and only crawlers ask.
export const dynamic = 'force-dynamic'

/**
 * Served at /sitemap.xml.
 *
 * Projects and blog posts are listed from the database rather than hardcoded,
 * so publishing either makes it discoverable without anyone remembering to
 * edit a list. A failure to read them must not take the whole sitemap down —
 * the static routes are the ones that matter most, and half a sitemap beats
 * a 500, so each query is caught separately.
 *
 * The project pages were missing from here entirely until now. /projects was
 * listed but none of the pages it links to were, which left the largest and
 * most valuable part of the site — a page per project — relying on Google
 * following links to find it.
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

  const payload = await getPayload({ config })

  // Each list is caught on its own, so a failure reading posts still leaves the
  // projects in the sitemap, and the other way round.
  let projectEntries: MetadataRoute.Sitemap = []
  try {
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 500,
      sort: 'order',
      overrideAccess: false,
      select: { slug: true, updatedAt: true },
    })

    projectEntries = docs.flatMap((project) =>
      project.slug
        ? [
            {
              url: `${SITE_URL}/projects/${project.slug}`,
              lastModified: new Date(project.updatedAt ?? now),
              // Higher than a post: these are the pages the business is
              // actually found on, and they change when a project is edited.
              changeFrequency: 'monthly' as const,
              priority: 0.8,
            },
          ]
        : [],
    )
  } catch (error) {
    console.error('[sitemap] could not list projects:', error)
  }

  let postEntries: MetadataRoute.Sitemap = []
  try {
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

    postEntries = docs.flatMap((post) =>
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
  } catch (error) {
    console.error('[sitemap] could not list posts:', error)
  }

  return [...staticEntries, ...projectEntries, ...postEntries]
}
