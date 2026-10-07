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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
