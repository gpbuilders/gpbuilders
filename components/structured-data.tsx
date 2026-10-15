const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Organization markup for the site root.
 *
 * This is what Google reads to associate a logo and a name with the domain —
 * the favicon alone only controls the small icon beside the URL. Without it,
 * Google infers everything from page text.
 *
 * `email` is the address on the contact page, and the two must not drift
 * apart: this is the address Google offers beside the phone number in a
 * search result, and now inside an AI Overview.
 *
 * That has already gone wrong once, which is why this file now states more
 * than it strictly has to. Until 29 September 2026 the contact page published
 * hello@gpbuilders.in, on a domain GP Builders does not own — one that is
 * live, parked on Squarespace, and accepting mail through Google Workspace.
 * The page was corrected that day. Two weeks later Google's AI Overview was
 * still answering "gp builders" with the old address and citing our own
 * contact page as its source, because it was serving a crawl from before the
 * fix.
 *
 * The lesson is not that the correction was wrong. It is that a fact written
 * only as prose inside a link is one Google has to re-read the page to
 * update, and this site is crawled slowly. A fact stated in JSON-LD is read
 * unambiguously the next time anything here is fetched. Hence the
 * ContactPoint and the opening hours below: both were already on the contact
 * page in words, and words are what put a stranger's address in front of
 * everyone searching for the company.
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
    email: 'projects@gpbuildersgroup.com',
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
    /**
     * The state is the claim; the cities are the evidence for it.
     *
     * "Tamil Nadu" alone is a broad assertion with nothing behind it, and it
     * is not how anyone searches — people ask for builders in a town, and an
     * answer engine asked "who builds in Chennai" has to match a city, not a
     * state. Naming the cities gives it something to match.
     *
     * These three are the ones GP Builders has actually delivered in, taken
     * from the project collection: 30 in Tiruchirappalli, two in Chennai
     * (Sholinganallur, Siruseri) and one in Pudukkottai (Madaiyur). A city
     * belongs on this list once there is work to point at — a name with no
     * project behind it is the kind of empty claim that earns nothing and
     * cannot be backed up when somebody follows it to the portfolio.
     *
     * Trichy is carried as alternateName because it is the name people use
     * and search for, while addressLocality above has to stay the official
     * Tiruchirappalli to match the Google Business Profile listing.
     */
    areaServed: [
      { '@type': 'State', name: 'Tamil Nadu' },
      {
        '@type': 'City',
        name: 'Tiruchirappalli',
        alternateName: 'Trichy',
        containedInPlace: { '@type': 'State', name: 'Tamil Nadu' },
      },
      {
        '@type': 'City',
        name: 'Chennai',
        containedInPlace: { '@type': 'State', name: 'Tamil Nadu' },
      },
      {
        '@type': 'City',
        name: 'Pudukkottai',
        containedInPlace: { '@type': 'State', name: 'Tamil Nadu' },
      },
    ],
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
    /**
     * The same address and number as the fields above, stated again as a
     * contact point.
     *
     * Not redundancy for its own sake. `email` and `telephone` on an
     * organisation say "this is how you reach the company"; a ContactPoint
     * says what the channel is for and who it serves, which is what an answer
     * engine is looking for when it builds a contact block. The duplication
     * is also the point: an assistant assembling an answer sees the same
     * address twice, from two independent statements, with nothing else on
     * the page to contradict it.
     *
     * `availableLanguage` is the one assumption here: an office in Trichy
     * taking enquiries in English and Tamil. Nobody confirmed it, so if the
     * firm does not want to answer in Tamil, drop 'ta' rather than leave a
     * promise in the markup that the phone does not keep.
     */
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'projects@gpbuildersgroup.com',
      telephone: '+919363699574',
      areaServed: 'IN',
      availableLanguage: ['en', 'ta'],
    },
    /**
     * The hours shown on the contact page, which until now lived only as three
     * lines of prose there.
     *
     * Google was already reading and repeating them correctly, so this is not
     * a correction — it is removing the need to parse a sentence to get them
     * right. Times are 24-hour, which is what the schema expects, and Sunday
     * is simply absent: a day with no entry is closed, and saying so with
     * opens and closes set to the same minute is how you end up published as
     * open at midnight.
     */
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
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
