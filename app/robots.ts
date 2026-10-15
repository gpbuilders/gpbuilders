import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Served at /robots.txt.
 *
 * Without this the site returns a 404 there, which crawlers tolerate but which
 * also means nothing points them at the sitemap.
 *
 * It lives at app/ rather than in the (frontend) group, which is where it sat
 * while /robots.txt quietly 404ed in production for months. Next generates
 * sitemap.ts from inside a route group perfectly happily but skips robots.ts
 * there without a warning, so the two are not interchangeable in placement
 * even though they are both metadata routes. Moving this file back under
 * (frontend) will silently break it again.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin panel and the API are not content. Crawling them wastes
        // budget on pages that redirect to a login, and keeps URLs nobody
        // should land on from appearing in results.
        disallow: ['/admin', '/admin/', '/api/', '/keepalive', '/enquiry'],
      },
    ],
    // The index, not a list of URLs: Google reads it and fetches
    // sitemap-pages.xml, sitemap-projects.xml and sitemap-posts.xml itself.
    sitemap: `${SITE_URL}/sitemap.xml`,
    // No `host` field, deliberately. Next will happily emit `Host:` here, but
    // Google does not implement it — its parser supports user-agent, allow,
    // disallow and sitemap, and says outright that everything else is ignored.
    // Search Console flagged it as "Rule ignored by Googlebot" from the first
    // day this file served, which makes a correct file look broken. The
    // directive came from Yandex as a way to declare a preferred mirror; the
    // way to tell Google to prefer the apex over www is a 301 and a canonical
    // tag, both of which live elsewhere and neither of which is this.
  }
}
