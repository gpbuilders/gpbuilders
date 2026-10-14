import config from '@payload-config'
import { getPayload } from 'payload'

import {
  SITE_URL,
  renderUrlSet,
  sitemapUnavailable,
  xmlResponse,
  type SitemapUrl,
} from '@/lib/sitemap'

/**
 * Served at /sitemap-posts.xml: the blog posts under /resources.
 *
 * Named for what they are rather than for the route they sit on, matching the
 * convention everywhere else: a sitemap called sitemap-resources.xml would
 * read like a list of downloads.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 500,
      sort: '-publishedAt',
      // Applies the collection's read rule, so drafts stay out. Submitting an
      // unpublished URL to Google is worse than omitting it.
      overrideAccess: false,
      select: { slug: true, updatedAt: true, publishedAt: true },
    })

    const urls: SitemapUrl[] = docs.flatMap((post) =>
      post.slug
        ? [
            {
              loc: `${SITE_URL}/resources/${post.slug}`,
              lastModified: new Date(post.updatedAt ?? post.publishedAt ?? Date.now()),
            },
          ]
        : [],
    )

    return xmlResponse(renderUrlSet(urls))
  } catch (error) {
    console.error('[sitemap-posts] could not list posts:', error)
    return sitemapUnavailable()
  }
}
