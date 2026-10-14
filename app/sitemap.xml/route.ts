import {
  SITE_URL,
  latestUpdate,
  renderSitemapIndex,
  staticPagesLastModified,
  xmlResponse,
} from '@/lib/sitemap'

/**
 * Served at /sitemap.xml — the index, not a list of URLs.
 *
 * This is the only sitemap URL robots.txt names and the only one worth
 * submitting in Search Console: Google reads the index and fetches each child
 * itself, then reports coverage against all four.
 *
 * It lives at app/ rather than inside the (frontend) group, next to robots.ts,
 * for the reason written in that file: metadata routes behave differently
 * inside a route group. A route handler would in fact work in either place,
 * but having /robots.txt and /sitemap.xml in two different parts of the tree
 * is the kind of split that makes the next person move one of them.
 *
 * Dynamic for the same reason the old sitemap was: a prerendered one ships in
 * the deployment bundle, and a container starting from it would serve dates
 * from the last deploy rather than from the database.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  // Three cheap queries rather than building each child sitemap in full: the
  // index needs one date per child, not the URLs inside it.
  const [pages, projects, posts] = await Promise.all([
    staticPagesLastModified(),
    latestUpdate('projects'),
    latestUpdate('posts'),
  ])

  return xmlResponse(
    renderSitemapIndex([
      { loc: `${SITE_URL}/sitemap-pages.xml`, lastModified: pages },
      // `?? undefined` and not a fallback date: if the query failed, the child
      // is still listed and still fetched, it just carries no claim about when
      // it last changed.
      { loc: `${SITE_URL}/sitemap-projects.xml`, lastModified: projects ?? undefined },
      { loc: `${SITE_URL}/sitemap-posts.xml`, lastModified: posts ?? undefined },
    ]),
  )
}
