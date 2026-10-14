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
 * Served at /sitemap-projects.xml: a page per project.
 *
 * This is the part of the site the business is found on, and the part Search
 * Console was least able to say anything useful about. The project pages were
 * missing from the sitemap entirely until recently — /projects was listed but
 * none of the 33 pages it links to were — so Google has only just been told
 * they exist. Reporting them on their own is how we find out whether they are
 * being crawled, rather than reading one number covering everything.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 500,
      sort: 'order',
      overrideAccess: false,
      select: { slug: true, updatedAt: true },
    })

    const urls: SitemapUrl[] = docs.flatMap((project) =>
      project.slug
        ? [
            {
              loc: `${SITE_URL}/projects/${project.slug}`,
              // Real, and the reason lastmod is worth writing at all: editing a
              // project moves exactly this date and nothing else.
              lastModified: new Date(project.updatedAt ?? Date.now()),
            },
          ]
        : [],
    )

    return xmlResponse(renderUrlSet(urls))
  } catch (error) {
    console.error('[sitemap-projects] could not list projects:', error)
    return sitemapUnavailable()
  }
}
