const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Organization markup for the site root.
 *
 * This is what Google reads to associate a logo and a name with the domain —
 * the favicon alone only controls the small icon beside the URL. Without it,
 * Google infers everything from page text.
 *
 * `email` is still missing on purpose. The address on the contact page is
 * hello@gpbuilders.in, a domain the company no longer uses, and inventing a
 * replacement would route enquiries nowhere. Add it here once a working
 * address exists — the contact form is a working channel in the meantime.
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
      'GP Builders delivers architecture, interior design, and construction for luxury residential and commercial spaces, based in Tiruchirappalli, Tamil Nadu.',
    slogan: 'Quality. Affordable.',
    // E.164 rather than the spaced form shown on the page: this is the value
    // a phone dials from a search result, and spaces are not reliably parsed.
    telephone: '+919363699574',
    address: {
      '@type': 'PostalAddress',
      // Srirangam belongs in the street address — addressLocality wants the
      // city, and Srirangam is a locality within Tiruchirappalli.
      streetAddress: '17/4, G-3, Pushpak Nagar, Srirangam',
      addressLocality: 'Tiruchirappalli',
      addressRegion: 'Tamil Nadu',
      postalCode: '620006',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'State',
      name: 'Tamil Nadu',
    },
    // Profiles that are the organisation itself. A personal LinkedIn does not
    // belong here — sameAs asserts "this profile IS this company" — so the
    // founder's is attached to him as a Person below instead.
    sameAs: ['https://www.instagram.com/gp_builders_trichy'],
    founder: {
      '@type': 'Person',
      name: 'Vignesh Chandrasekaran',
      jobTitle: 'Founder',
      image: `${SITE_URL}/vignesh-chandrasekaran.webp`,
      sameAs: ['https://www.linkedin.com/in/vignesh-chandrasekaran-8b432843a'],
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
