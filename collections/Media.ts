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
    // Originals were ~85% of stored bytes, averaging 4MB, because phone and
    // camera files go in untouched. Nothing is ever served above 1920px, so
    // capping at 2560 keeps a comfortable master while cutting the bulk of it.
    resizeOptions: {
      width: 2560,
      height: undefined,
      fit: 'inside',
      // Never upscale a small image just to reach the cap.
      withoutEnlargement: true,
    },
    // WebP rather than JPEG so logos and cut-outs keep their transparency.
    // 90 rather than the usual 82: this is the master, and Next re-encodes it
    // again on the way to the browser, so lossy compression is applied twice.
    // The extra ~100KB buys headroom against that compounding, and detail
    // thrown away here cannot be recovered later.
    formatOptions: {
      format: 'webp',
      options: { quality: 90 },
    },
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
