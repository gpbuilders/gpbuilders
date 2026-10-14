import config from '@payload-config'
import { getPayload } from 'payload'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * The sitemap is split into an index at /sitemap.xml pointing at one child per
 * kind of page: /sitemap-pages.xml, /sitemap-projects.xml, /sitemap-posts.xml.
 *
 * One flat file was perfectly legal — the limit is 50,000 URLs and the site has
 * 45 — so the reason to split is not size. It is that Search Console reports
 * coverage per submitted sitemap. With one file, "20 discovered, currently not
 * indexed" is a number with no shape: it could be twenty project pages or four
 * posts and sixteen projects, and there is no way to tell from the report. With
 * three, the same screen says which kind of page Google is sitting on, and the
 * next thing to fix is visible rather than inferred.
 *
 * It also lets a crawl of the projects recover on its own: each child carries
 * its own lastmod, so publishing a project moves one date instead of making the
 * whole sitemap look new.
 *
 * Shared helpers live here so the four routes agree on URL shape and date
 * format. Three files that each build their own XML is three places for the
 * host or the trailing slash to drift.
 */

export type SitemapUrl = {
  loc: string
  lastModified: Date
}

export type SitemapIndexEntry = {
  loc: string
  /** Omitted when the query behind a child failed — lastmod is optional, and
   *  guessing a date is worse than leaving it out. */
  lastModified?: Date
}

/**
 * W3C datetime, to the second, in UTC: 2026-10-13T18:12:27+00:00.
 *
 * `toISOString()` would give `…:27.000Z`, which is equally valid and which no
 * other sitemap on the web is written in. Matching the ordinary form keeps the
 * file readable to a person checking it by eye.
 */
export function formatSitemapDate(date: Date): string {
  return `${date.toISOString().slice(0, 19)}+00:00`
}

/**
 * Slugs are generated from titles and have never contained one of these, but a
 * sitemap is XML and an unescaped `&` makes the whole file unparseable — which
 * Search Console reports as "Couldn't fetch", several days after the fact.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Neither `<priority>` nor `<changefreq>` is written any more, and their
 * absence is the point rather than an omission.
 *
 * Google has said for years that it ignores both: priority is a relative
 * ranking of your own pages against each other, which tells it nothing it
 * cannot see, and changefreq lost to simply watching how often a page actually
 * changes. The old sitemap declared /projects "weekly" and /terms "monthly"
 * and neither claim ever affected anything. `lastmod` is the one hint Google
 * does still read, and only while it stays honest — which is why the dates
 * here come from the database and from a maintained constant, not from
 * `new Date()`.
 */
export function renderUrlSet(urls: SitemapUrl[]): string {
  const body = urls
    .map(
      ({ loc, lastModified }) =>
        `  <url>\n` +
        `    <loc>${escapeXml(loc)}</loc>\n` +
        `    <lastmod>${formatSitemapDate(lastModified)}</lastmod>\n` +
        `  </url>`,
    )
    .join('\n')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</urlset>\n`
  )
}

export function renderSitemapIndex(children: SitemapIndexEntry[]): string {
  const body = children
    .map(({ loc, lastModified }) =>
      lastModified
        ? `  <sitemap>\n` +
          `    <loc>${escapeXml(loc)}</loc>\n` +
          `    <lastmod>${formatSitemapDate(lastModified)}</lastmod>\n` +
          `  </sitemap>`
        : `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n  </sitemap>`,
    )
    .join('\n')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</sitemapindex>\n`
  )
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  })
}

/**
 * What to answer when the database could not be reached.
 *
 * Deliberately a 503 and not an empty `<urlset/>`. An empty sitemap is a valid
 * document that says "there are no project pages", and Google believes it —
 * the URLs drop out of the submitted set and have to be rediscovered. A 503
 * says "ask again later", which is the truth, and the previously submitted
 * URLs stay where they are.
 */
export function sitemapUnavailable(): Response {
  return new Response('', {
    status: 503,
    headers: { 'cache-control': 'no-store' },
  })
}

/**
 * The fixed pages, with the date each was last meaningfully changed.
 *
 * Maintained by hand, and that is the trade-off taken knowingly. The previous
 * sitemap stamped every page with `new Date()`, so each fetch claimed all eight
 * had changed in the last second. Google's documentation is explicit that it
 * uses lastmod only while a site reports it consistently and accurately, and a
 * site that says "everything changed just now" on every crawl teaches it to
 * ignore the field altogether — which also throws away the accurate dates on
 * the 37 database-driven pages.
 *
 * So: when you change what one of these pages says, move its date. The
 * seed values are the commit that gave all eight their own titles and
 * descriptions, which is genuinely the last time their content changed.
 */
export const STATIC_PAGES: { path: string; lastModified: string }[] = [
  { path: '', lastModified: '2026-10-13T18:12:27Z' },
  { path: '/projects', lastModified: '2026-10-13T18:20:57Z' },
  { path: '/services', lastModified: '2026-10-13T18:12:27Z' },
  { path: '/about', lastModified: '2026-10-13T18:12:27Z' },
  { path: '/resources', lastModified: '2026-10-13T18:12:27Z' },
  { path: '/contact', lastModified: '2026-10-13T18:12:27Z' },
  { path: '/privacy-policy', lastModified: '2026-10-13T18:12:27Z' },
  { path: '/terms', lastModified: '2026-10-13T18:12:27Z' },
]

/**
 * Pages whose content is a list of something in the database, so publishing a
 * record changes the page even though no file moved. Their lastmod is the
 * later of the hand-maintained date above and the newest record they show.
 */
const LIST_PAGES: Record<string, 'projects' | 'posts'> = {
  '': 'projects',
  '/projects': 'projects',
  '/resources': 'posts',
}

const latest = (a: Date, b: Date | null) => (b && b > a ? b : a)

/**
 * The newest `updatedAt` in a collection, or null if it could not be read.
 *
 * `limit: 1` with a sort, rather than counting or listing: this runs on the
 * sitemap index, which exists to be cheap.
 */
export async function latestUpdate(
  collection: 'projects' | 'posts',
): Promise<Date | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection,
      depth: 0,
      limit: 1,
      sort: '-updatedAt',
      // Applies the collection's read rule, so an unpublished draft cannot set
      // the date on a sitemap that does not list it.
      overrideAccess: false,
      select: { updatedAt: true },
    })

    const updatedAt = docs[0]?.updatedAt
    return updatedAt ? new Date(updatedAt) : null
  } catch (error) {
    console.error(`[sitemap] could not read latest ${collection}:`, error)
    return null
  }
}

/** The eight fixed pages, with the list pages' dates brought up to date. */
export async function staticPageUrls(): Promise<SitemapUrl[]> {
  const [newestProject, newestPost] = await Promise.all([
    latestUpdate('projects'),
    latestUpdate('posts'),
  ])

  return STATIC_PAGES.map(({ path, lastModified }) => {
    const own = new Date(lastModified)
    const source = LIST_PAGES[path]

    return {
      loc: `${SITE_URL}${path}`,
      lastModified: source
        ? latest(own, source === 'projects' ? newestProject : newestPost)
        : own,
    }
  })
}

/** The newest date across the eight fixed pages, for the index's lastmod. */
export async function staticPagesLastModified(): Promise<Date> {
  const urls = await staticPageUrls()
  return urls.reduce(
    (newest, url) => (url.lastModified > newest ? url.lastModified : newest),
    new Date(0),
  )
}
