import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Jost, Marcellus } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { OrganizationSchema, WebSiteSchema } from '@/components/structured-data'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const TITLE = 'GP Builders | Quality at an Affordable Price'
const DESCRIPTION =
  'GP Builders delivers architecture, interior design, and construction for luxury residential and commercial spaces. Quality construction and interiors at an affordable price.'

// Set NEXT_PUBLIC_SERVER_URL to the live domain before deploying — without it
// Open Graph tags resolve against localhost and social previews break.
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Resolved against metadataBase for whatever path is rendering, so every
  // page declares itself canonical rather than pointing at the home page.
  alternates: { canonical: './' },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'GP Builders',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    siteName: 'GP Builders',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GP Builders — architecture, interiors, and construction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#2f6169',
}

/**
 * Every public page is served from cache and rebuilt at most once a minute.
 *
 * Route segment config cascades, so this one line covers the whole frontend
 * and a page added later cannot forget it.
 *
 * The minute is a backstop, not the update latency. An edit in the admin shows
 * up within seconds, because each collection's afterChange hook purges the
 * paths it affects (see lib/revalidate.ts). This catches whatever a hook does
 * not — a direct database write, or a relationship nobody thought to map.
 *
 * Why not render every request instead: the database is in Sydney and the app
 * runs in Mumbai, so each query is a ~300ms round trip. Measured on this app,
 * rendering per request costs 1.5s on the home and projects pages and 2.3s on
 * a project page, before Amplify's 10-14s cold start. From cache it is ~30ms.
 *
 * Why this also fixed the stale CDN copies: a page with no revalidate is
 * treated as permanent and goes out with s-maxage=31536000, which CloudFront
 * held onto for a year. Declaring the interval sends s-maxage=60 instead.
 */
export const revalidate = 60

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${jost.variable} ${marcellus.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <OrganizationSchema />
        <WebSiteSchema />
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
