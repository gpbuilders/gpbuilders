import { NextResponse } from 'next/server'

/**
 * Lets CloudFront hold the public pages for a minute.
 *
 * Every page is rendered per request — see the `dynamic` export in the
 * frontend layout for why that is not negotiable on this host — and Amplify's
 * default for a server-rendered response is no caching at all. So every
 * visitor, every crawl and every reload went back to the Lambda in Mumbai.
 * Measured against production:
 *
 *     favicon.ico      (pure CDN)            0.187 s
 *     robots.txt       (static route)        0.170 s
 *     /contact         (dynamic, no DB)      0.325 s
 *     /                (dynamic, cached DB)  0.486 s
 *
 * The database is no longer in that picture; the gap between a CDN-served
 * file and a rendered page is the trip to the origin and back. This closes it
 * for the pages listed at the bottom.
 *
 * WHY MIDDLEWARE AND NOT customHttp.yml
 *
 * Amplify's own header file takes precedence over everything and is the
 * documented way to do this, but its patterns are globs with no way to
 * exclude. `**​/*` would also cover /api, and /api/users/me returns whoever is
 * logged in — a shared cache is the last place that belongs. The matcher below
 * is an explicit list instead, so a route is cached because someone named it,
 * never because a wildcard reached it. A public page added later and left off
 * the list is simply uncached, which is the right way round for a mistake.
 *
 * WHY THESE PAGES ARE SAFE AT A SHARED EDGE
 *
 * They are identical for every visitor. No cookies are set on them, and six
 * fetches of each returned a single md5. The colour-scheme client hint the
 * layout asks for changes nothing — light, dark and absent all hash the same.
 *
 * THE ONE THAT NEARLY BIT, AND WHAT ACTUALLY PREVENTS IT
 *
 * A page and its React payload share a path. Next tells caches them apart with
 * `Vary: rsc, next-router-state-tree, ...`, which this app sends locally and
 * which reaches the browser through Amplify as `Vary: Accept-Encoding` — the
 * RSC entries are stripped somewhere in between, and CloudFront would not key
 * on them anyway. If the cache keyed on the path alone, an edge could answer a
 * browser asking for a document with a React payload, or the reverse: a broken
 * site, intermittent, different per edge location, invisible from here.
 *
 * It cannot, because the two use different URLs. A real navigation fetches
 * `/about?_rsc=6UYzayz0fDkWEbIu`, and the query string is part of the cache
 * key. Measured on production: /_next/image for one source image at w=256 and
 * w=1920 returned 9,110 and 86,922 bytes, both missed on first request, and
 * both hit on the second. Two URLs, two entries.
 *
 * Do not try to tell the two apart in here. It looks easy and it is not:
 * Next strips both signals before middleware runs. With curl sending
 * `RSC: 1` to `/about?_rsc=abc`, this function sees no rsc header and
 * `request.url` of exactly `http://host/about` — no query at all. Two
 * attempts at a guard were written here and both were dead code that a debug
 * header caught. The separation is the cache key's job, not this file's.
 *
 * WHAT IT COSTS
 *
 * An edit can sit behind the edge for up to the minute below, on top of the
 * five that lib/cached-content.ts may hold a database read: six in the worst
 * case, usually none. A deploy clears the CDN cache outright, and most saves
 * land in a container that drops its own copy immediately.
 *
 * Sixty seconds is deliberately short — enough for a crawler walking the
 * sitemap, a visitor moving around, and any burst of traffic, while keeping
 * the staleness too small to have to think about. Raise it once this has
 * proven itself if an editor never needs a change inside a minute.
 */
const EDGE_TTL_SECONDS = 60

export function middleware() {
  const response = NextResponse.next()

  // s-maxage is for CloudFront; max-age=0 keeps the browser asking, so someone
  // who reloads gets what the edge has rather than their own older copy.
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${EDGE_TTL_SECONDS}, max-age=0, must-revalidate`,
  )

  return response
}

/** Named one at a time, deliberately. /admin and /api must never appear here. */
export const config = {
  matcher: [
    '/',
    '/about',
    '/services',
    '/contact',
    '/terms',
    '/privacy-policy',
    '/projects',
    '/projects/:slug',
    '/resources',
    '/resources/:slug',
  ],
}
