import config from '@payload-config'
import { getPayload } from 'payload'

import { mediaAlt, mediaUrl, type MediaField } from '@/lib/media'

/** A still — the two page-header artworks are always this. */
export type HeroImage = { kind: 'image'; src: string; alt: string }

/**
 * A looping background video. `poster` is what shows while it downloads and
 * what replaces it entirely for a visitor who has asked to reduce motion, so
 * it is not optional at the point of use — a slide without one is dropped.
 */
export type HeroVideo = { kind: 'video'; src: string; poster: string; alt: string }

export type HeroSlide = HeroImage | HeroVideo

export type HeroMediaResolved = {
  homeSlides: HeroSlide[]
  pageHeroArt: HeroImage
  aboutSketch: HeroImage
}

/**
 * What the site renders when the global has not been filled in — the images
 * committed to public/, which is exactly how the site looked before any of this
 * was configurable. Nothing here can 404.
 */
const FALLBACK: HeroMediaResolved = {
  homeSlides: [
    { kind: 'image', src: '/interior-hallway.jpg', alt: 'Modern interior hallway with terracotta' },
    { kind: 'image', src: '/project-living-room.png', alt: 'Luxury living room design' },
    { kind: 'image', src: '/exterior-render.jpg', alt: 'Exterior architectural rendering' },
    { kind: 'image', src: '/project-kitchen.png', alt: 'Modern kitchen design' },
    { kind: 'image', src: '/commercial-restaurant.jpg', alt: 'Commercial restaurant design' },
  ],
  pageHeroArt: { kind: 'image', src: '/architecture-line-art.png', alt: 'Architecture sketch' },
  aboutSketch: { kind: 'image', src: '/architecture-sketch.png', alt: 'Architectural building sketch' },
}

function resolve(media: MediaField, fallback: HeroImage): HeroImage {
  const src = mediaUrl(media, '')
  return src ? { kind: 'image', src, alt: mediaAlt(media, fallback.alt) } : fallback
}

/** Videos are their own collection, so they need their own narrowing. */
function videoUrl(video: unknown): { src: string; caption: string } | null {
  if (typeof video !== 'object' || !video) return null
  const doc = video as { url?: string | null; caption?: string | null }
  return doc.url ? { src: doc.url, caption: doc.caption ?? '' } : null
}

/**
 * Reads the hero images, falling back per field rather than all-or-nothing —
 * uploading a new About sketch should not require also uploading a slideshow.
 *
 * A failure here must not take a page down: the global's table does not exist
 * until its migration has run, and every caller is a page that has plenty else
 * to render. On error the committed images are used and the reason is logged.
 */
export async function getHeroMedia(): Promise<HeroMediaResolved> {
  try {
    const payload = await getPayload({ config })
    // depth 1 populates the upload fields into full Media documents.
    const hero = await payload.findGlobal({ slug: 'hero-media', depth: 1 })

    // A slide whose file is missing is dropped rather than rendered empty.
    // The conditional fields mean a half-filled slide is easy to save, and a
    // blank full-screen panel in a carousel is worse than one fewer slide.
    const slides = (hero.homeSlides ?? []).flatMap<HeroSlide>((slide) => {
      if (slide.kind === 'video') {
        const video = videoUrl(slide.video)
        const poster = mediaUrl(slide.poster, '')
        if (!video || !poster) return []
        return [{
          kind: 'video',
          src: video.src,
          poster,
          alt: video.caption || mediaAlt(slide.poster, 'GP Builders project footage'),
        }]
      }

      const src = mediaUrl(slide.image, '')
      if (!src) return []
      return [{ kind: 'image', src, alt: mediaAlt(slide.image, '') }]
    })

    return {
      homeSlides: slides.length > 0 ? slides : FALLBACK.homeSlides,
      pageHeroArt: resolve(hero.pageHeroArt, FALLBACK.pageHeroArt),
      aboutSketch: resolve(hero.aboutSketch, FALLBACK.aboutSketch),
    }
  } catch (error) {
    console.error('[hero-media] falling back to the committed images:', error)
    return FALLBACK
  }
}
