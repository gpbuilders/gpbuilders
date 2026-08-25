import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Admin',
  },
  upload: {
    // Local-development fallback only. When S3_BUCKET is set, the s3Storage
    // plugin in payload.config.ts takes over and disables local storage —
    // public/media is neither served nor persisted on an ephemeral host.
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO.',
      },
    },
  ],
}
