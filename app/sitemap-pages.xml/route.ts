import { renderUrlSet, staticPageUrls, xmlResponse } from '@/lib/sitemap'

/**
 * Served at /sitemap-pages.xml: the eight fixed pages.
 *
 * Kept apart from the project and post pages because these are the ones whose
 * indexing is not in question — they are linked from every page of the site
 * and Google has had them for a long time. Separating them means the coverage
 * figure for the other two sitemaps is about the pages that actually need
 * watching, instead of being diluted by eight pages that are always fine.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  return xmlResponse(renderUrlSet(await staticPageUrls()))
}
