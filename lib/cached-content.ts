import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { getHeroMedia, type HeroMediaResolved } from '@/lib/hero-media'
import type { Post, Project } from '@/payload-types'

/**
 * The database reads that every visitor waits for, held between requests.
 *
 * WHY THIS EXISTS
 *
 * The home page's largest element is the hero paragraph — static text that
 * depends on nothing in the database. Measured on a throttled mobile load it
 * painted at 4,524 ms, and 4,355 ms of that was time to first byte. The
 * element itself took 169 ms to render once a byte arrived. Nothing about the
 * markup, the CSS or the fonts was the problem: the server simply had not
 * spoken yet.
 *
 * What it was doing, measured against the live database, three runs:
 *
 *     getHeroMedia()              618-631 ms
 *     projects depth:1 limit:4    931-933 ms
 *     both, in Promise.all        930-935 ms
 *
 * Postgres is in Sydney and every round trip crosses an ocean. The two run in
 * parallel already, so the page waits about a second before the first byte,
 * and the paragraph that paints last is waiting on data it never reads.
 *
 * WHAT THIS CHANGES
 *
 * Both reads are now held in Next's data cache. A warm server answers from
 * memory and the ocean crossing happens once per interval instead of once per
 * visitor. The hero global is read by four pages — home, projects, about and
 * services — so /services, which awaits nothing else, goes from about 615 ms
 * of server time to almost none.
 *
 * WHAT IT COSTS
 *
 * An edit can take up to REVALIDATE_SECONDS to appear. In practice it is
 * usually immediate: the collection hooks call revalidateTags() on save, which
 * drops these entries at once. The interval is the backstop for the case the
 * hooks cannot cover — Amplify runs this on Lambda, each container holds its
 * own cache, and a purge raised in the container that handled the save does
 * not reach a container that was busy elsewhere. That container keeps its copy
 * until the interval expires.
 *
 * So: normally instant, never longer than the interval below. If that is ever
 * too long for an editor, lower it; the only cost of a shorter interval is
 * more round trips to Sydney.
 *
 * None of this is a substitute for moving the database to Mumbai, which would
 * take the uncached path from about a second to roughly a tenth of that and
 * help every query on the site rather than these two.
 */
const REVALIDATE_SECONDS = 300

/** Tag names, used both to store and to purge. Keep them in one place: a typo
 *  in a purge is silent — nothing errors, the cache simply never clears. */
export const HERO_MEDIA_TAG = 'hero-media'
export const PROJECTS_TAG = 'projects'
export const POSTS_TAG = 'posts'

/**
 * The hero global, as read by every page that renders a hero.
 *
 * The safest thing on the site to hold: it is a single global, edited a
 * handful of times a year, and getHeroMedia already falls back to images
 * committed in public/ when the read fails, so nothing here is load-bearing
 * enough to need per-request freshness.
 */
export const getCachedHeroMedia = unstable_cache(
  (): Promise<HeroMediaResolved> => getHeroMedia(),
  ['hero-media'],
  { tags: [HERO_MEDIA_TAG], revalidate: REVALIDATE_SECONDS },
)

/**
 * The four projects the home page's Featured Projects row shows.
 *
 * depth: 1 is what populates each project's image, and it is not free — the
 * same query at depth 0 comes back in 613 ms against 933 ms, so resolving the
 * relations costs an extra round trip. Worth paying once per interval; not
 * worth paying once per visitor.
 */
export const getCachedHomeProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 4,
      sort: 'order',
    })
    return docs
  },
  ['home-projects'],
  { tags: [PROJECTS_TAG], revalidate: REVALIDATE_SECONDS },
)

/**
 * Everything below is the same treatment applied to the rest of the site,
 * after measuring what a visitor pays to move around it.
 *
 * Every page is rendered per request, so a link click is a server render, and
 * each of these was an uncached crossing to Sydney. Measured against the live
 * database, two rounds:
 *
 *     /projects   projects depth:1 limit:100    977-1593 ms
 *     /resources  posts    depth:1 limit:50     929-948 ms
 *     [slug]      find the project by slug      937-994 ms
 *     [slug]      related, by its category      936-942 ms
 *
 * The last two are serial — the related query needs the category it reads off
 * the first — so a project page cost about 1.9 seconds, which is exactly what
 * a navigation to one measured at. The queries are unchanged here; only their
 * results are held. Each keeps the options it already had, including
 * `overrideAccess: false` where the route had it, because on posts that flag
 * is what keeps drafts off the public page.
 */

/** The Projects page: every project, newest arrangement first. */
export const getCachedAllProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 100,
      sort: 'order',
    })
    return docs
  },
  ['all-projects'],
  { tags: [PROJECTS_TAG], revalidate: REVALIDATE_SECONDS },
)

/**
 * One project, by slug.
 *
 * Kept as its own query rather than picked out of the list above. The list is
 * capped at 100, and a site that grows past that cap would start answering 404
 * for its oldest projects — a quiet failure that would be found by a visitor
 * rather than by us. A second cache entry is cheaper than that risk.
 */
export const getCachedProject = unstable_cache(
  async (slug: string): Promise<Project | undefined> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    return docs[0]
  },
  ['project-by-slug'],
  { tags: [PROJECTS_TAG], revalidate: REVALIDATE_SECONDS },
)

/** The two others shown at the foot of a project page. */
export const getCachedRelatedProjects = unstable_cache(
  async (category: Project['category'], excludeId: number | string): Promise<Project[]> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 1,
      limit: 2,
      sort: 'order',
      where: { category: { equals: category }, id: { not_equals: excludeId } },
      overrideAccess: false,
    })
    return docs
  },
  ['related-projects'],
  { tags: [PROJECTS_TAG], revalidate: REVALIDATE_SECONDS },
)

/** The Resources index. overrideAccess stays off: it is what hides drafts. */
export const getCachedPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 50,
      sort: '-publishedAt',
      overrideAccess: false,
    })
    return docs
  },
  ['all-posts'],
  { tags: [POSTS_TAG], revalidate: REVALIDATE_SECONDS },
)

/** One article, by slug. Same draft rule as the index. */
export const getCachedPost = unstable_cache(
  async (slug: string): Promise<Post | undefined> => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
      overrideAccess: false,
    })
    return docs[0]
  },
  ['post-by-slug'],
  { tags: [POSTS_TAG], revalidate: REVALIDATE_SECONDS },
)
