import type { CollectionConfig } from 'payload'

import { revalidateEverything } from '@/lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    // Sits with Projects, not with Users: this is material the client
    // uploads, not administration of the site.
    group: 'Content',
    description: 'Every image used across the site. Uploading here is optional — adding one to a project uploads it for you.',
  },
  // Replacing a file here used to refresh nothing at all, which made the media
  // library the one place in the admin where a save appeared to do nothing:
  // the page kept the old photograph until the next deploy. A replacement also
  // gets a new filename in the bucket, so the stale page pointed at an object
  // that no longer existed.
  //
  // Which pages an image reaches cannot be known from the image, so all of
  // them are purged — see revalidateEverything for why that is the cheap
  // option rather than the lazy one.
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        void revalidateEverything(req.payload)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        void revalidateEverything(req.payload)
        return doc
      },
    ],
  },
  upload: {
    // Without this, Payload leaves thumbnailURL null and the admin falls back
    // to the full-size master for every tile — which is what it was doing.
    // Naming the size here is the whole of what makes it get used: the 400x300
    // file was being generated and uploaded on every upload and never once
    // requested. The media library goes from 6.0MB a screen to 442KB.
    adminThumbnail: 'thumbnail',
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
    // formatOptions above converts the master only — derived sizes keep the
    // source format unless told otherwise, which is how 54 .jpg and .png
    // files ended up in a bucket that was supposed to hold WebP.
    //
    // Only one size survives, and only for the admin. `card` and `hero` were
    // generated and uploaded on every upload and then never requested:
    // nothing reads media.sizes, because mediaUrl() returns the master and
    // next/image derives whatever width it actually serves. They were 75% of
    // the bucket.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        // Payload's admin list and gallery views read this one, so it earns
        // its place — a 2560px master behind every tile makes those screens
        // slow to load.
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
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
