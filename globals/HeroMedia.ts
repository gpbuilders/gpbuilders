import type { GlobalConfig, Payload } from 'payload'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

// Every page that renders a hero is statically generated, so an upload here
// stays invisible until they are revalidated.
const DEPENDENT_PATHS = ['/', '/about', '/projects', '/services'] as const

async function revalidateHeroes(payload: Payload) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of DEPENDENT_PATHS) {
      revalidatePath(path)
    }
    payload.logger.info(`Revalidated ${DEPENDENT_PATHS.join(', ')}`)
  } catch {
    payload.logger.warn('Skipped revalidation (no Next.js cache in this context)')
  }
}

/**
 * The images behind the page headers.
 *
 * A global rather than a collection: this is one screen of site-wide settings,
 * not a list of records anyone browses. Every field is optional, and the
 * frontend falls back to the image committed in public/ when one is empty —
 * so an unconfigured global renders the site exactly as it looks today rather
 * than leaving a hole where the hero should be.
 */
export const HeroMedia: GlobalConfig = {
  slug: 'hero-media',
  label: 'Hero Media',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Content',
    description:
      'The photographs, video and artwork behind the page headers. Leave any of these empty to keep what the site ships with.',
  },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        void revalidateHeroes(req.payload)
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'homeSlides',
      type: 'array',
      label: 'Home page slideshow',
      labels: { singular: 'Slide', plural: 'Slides' },
      admin: {
        description:
          'What fades through behind the home page headline — photographs, video, or a mix. Drag to reorder; the first one is what a visitor sees on arrival. Leave empty to keep the five the site ships with.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Photograph', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
          admin: {
            description: 'What this slide shows.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          // Not `required`: Payload validates fields that a condition has
          // hidden, so requiring this would block saving any video slide.
          // A slide missing its file is dropped when the page reads it.
          admin: {
            condition: (_, siblingData) => siblingData?.kind !== 'video',
            description:
              'Landscape crops best — this is displayed full-bleed and full-height.',
          },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'videos',
          admin: {
            condition: (_, siblingData) => siblingData?.kind === 'video',
            description:
              'Plays muted and loops, like a background. Keep it short and under ~10MB.',
          },
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.kind === 'video',
            description:
              'A still shown while the video loads, and instead of it for visitors who have asked their device to reduce motion. Without one the slide is blank until the video arrives.',
          },
        },
      ],
    },
    {
      name: 'pageHeroArt',
      type: 'upload',
      relationTo: 'media',
      label: 'Projects & Services header artwork',
      admin: {
        description:
          'The line drawing on the right of the dark header, shared by both pages. A transparent PNG works best; it sits at 60% opacity over the dark ground.',
      },
    },
    {
      name: 'aboutSketch',
      type: 'upload',
      relationTo: 'media',
      label: 'About page sketch',
      admin: {
        description:
          'The drawing beside the About headline. Shown whole rather than cropped, so any shape works.',
      },
    },
  ],
}
