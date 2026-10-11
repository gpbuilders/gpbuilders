import Script from 'next/script'

/**
 * GA4 measurement ID.
 *
 * Hardcoded rather than read from an environment variable, deliberately. The
 * ID is public — it ships in the HTML of every page either way, so there is
 * nothing to protect — and the last analytics service on this site collected
 * nothing for months because it was never wired up correctly on the host. A
 * constant cannot be forgotten in an Amplify settings panel.
 *
 * Changing or removing this means changing clause 4 of the privacy policy,
 * which names the cookies it sets and what it collects.
 */
const GA_ID = 'G-QDXD8QFBNZ'

/**
 * Loaded on the public site only. This renders in app/(frontend)/layout.tsx,
 * so it never reaches /admin: the team's own editing sessions are not visitor
 * behaviour, and counting them would quietly skew every number on the site.
 *
 * Not loaded in development either, so `next dev` does not file page views
 * for localhost against the live property.
 *
 * No page-view call is wired up for client-side navigation, which this site
 * does for every link in the header. GA4's enhanced measurement watches the
 * History API and files those itself: walking / -> /about -> /services ->
 * /projects against a production build of this page sends exactly one
 * page_view per URL. Adding our own on top sent two for each.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null

  return (
    <>
      {/* afterInteractive, not beforeInteractive: analytics has no business
          competing with the page for the main thread before it is usable. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
