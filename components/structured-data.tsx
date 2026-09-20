const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Organization markup for the site root.
 *
 * This is what Google reads to associate a logo and a name with the domain —
 * the favicon alone only controls the small icon beside the URL. Without it,
 * Google infers everything from page text.
 *
 * Deliberately limited to facts that can be verified from the site itself.
 * The phone number and email address currently in components/contact.tsx are
 * placeholders (+91 98765 43210, and an address on a domain the company no
 * longer uses), and publishing those as machine-readable business data is
 * worse than publishing nothing: Google surfaces `telephone` in results, so a
 * dummy number sends real callers to a stranger. Add `telephone`, `email` and
 * a full `address` here once the real ones are known.
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#organization`,
    name: 'GP Builders',
    alternateName: 'GP Builders Group',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'GP Builders delivers architecture, interior design, and construction for luxury residential and commercial spaces in Chennai.',
    slogan: 'Quality. Affordable.',
    areaServed: {
      '@type': 'State',
      name: 'Tamil Nadu',
    },
    knowsAbout: [
      'Architectural design',
      'Construction',
      'Interior design',
      'Landscape design',
    ],
  }

  return (
    <script
      type="application/ld+json"
      // The object is built here from literals, not from user input, so there
      // is nothing to escape. Next requires this form for JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * WebSite markup, which is what lets Google show a sitelinks search box and
 * tells it the site's canonical name rather than guessing from the <title>.
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'GP Builders',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
