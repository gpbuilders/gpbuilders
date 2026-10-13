import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** The card picture for any page without one of its own. */
export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'GP Builders — architecture, interiors, and construction',
}

/**
 * The parts of a share card that are the same on every page. The root layout
 * spreads these too, so there is one definition rather than two that drift.
 */
export const OG_SHARED = {
  type: 'website',
  siteName: 'GP Builders',
  locale: 'en_IN',
  images: [OG_IMAGE],
  // `satisfies`, not `as const`: the literal 'website' has to survive for the
  // OpenGraphWebsite type to match, but `as const` also freezes the images
  // array, and Next's types want a mutable one.
} satisfies NonNullable<Metadata['openGraph']>

export const TWITTER_SHARED = {
  card: 'summary_large_image',
  images: [OG_IMAGE.url],
} satisfies NonNullable<Metadata['twitter']>

/**
 * Title and description for one page, with the share card kept in step.
 *
 * Two bugs live here, and both are the same bug: Next merges metadata one key
 * at a time, and `openGraph` is one key.
 *
 * A page that set only `title` and `description` never touched the layout's
 * openGraph, so the layout's values stayed. Measured on production, /projects,
 * /contact, /about and the rest all served an `og:title` of "GP Builders |
 * Quality at an Affordable Price". The title was right in the tab and in
 * search results, and wrong in every link shared to WhatsApp or LinkedIn.
 *
 * Setting `openGraph: { title, description }` on the page fixes that and
 * breaks the other half: the page's object replaces the layout's whole object,
 * which took og:image, og:site_name, og:locale, og:url and og:type with it.
 * Cards came out with the right words and no picture.
 *
 * So the whole object is assembled here, from the shared parts above plus this
 * page's own words. Going through one function is what stops the pair drifting
 * again — there is no way to set a title and forget the card.
 */
export function pageMetadata({
  title,
  description,
  path = '/',
  images,
}: {
  title: string
  description: string
  /** This page's path, so og:url points at the page rather than the home page. */
  path?: string
  images?: NonNullable<Metadata['openGraph']>['images']
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      ...OG_SHARED,
      ...(images ? { images } : {}),
      title,
      description,
      url: `${SITE_URL}${path === '/' ? '' : path}`,
    },
    twitter: {
      ...TWITTER_SHARED,
      title,
      description,
    },
  }
}
