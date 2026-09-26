import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Served at /robots.txt.
 *
 * Without this the site returns a 404 there, which crawlers tolerate but which
 * also means nothing points them at the sitemap.
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
