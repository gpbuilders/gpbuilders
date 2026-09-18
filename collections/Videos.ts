import type { CollectionConfig } from 'payload'

const authenticated = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

/**
 * Video files, kept apart from Media on purpose.
 *
 * Media runs every upload through sharp — resize, WebP, three derived sizes —
 * which is meaningless for video. More importantly, Media is what the project
 * image, the gallery and the post cover all point at, and none of those can
 * render a video. Widening that collection's mime types would let an editor
 * pick an .mp4 for a project card and break the page; a separate collection
 * makes that impossible rather than merely unlikely.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Video', plural: 'Videos' },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'caption', 'filesize', 'createdAt'],
    group: 'Content',
    description:
      'Video used in the home page slideshow. Keep files under ~10MB — a hero video downloads before anything else on the page.',
  },
  upload: {
    staticDir: 'public/videos',
    // MP4 (H.264) is the only format every browser plays. WebM is here for a
    // smaller second source if one is ever supplied.
    mimeTypes: ['video/mp4', 'video/webm'],
  },
  fields: [
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'What the footage shows. Used as the accessible description, so write it for someone who cannot see it.',
      },
    },
  ],
}
