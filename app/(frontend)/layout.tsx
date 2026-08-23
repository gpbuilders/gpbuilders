import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Jost, Marcellus } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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
