import { withPayload } from '@payloadcms/next/withPayload'

// Parsed once so a malformed value fails the build loudly rather than silently
// disabling image optimisation for every uploaded image.
const serverOrigin = process.env.NEXT_PUBLIC_SERVER_URL
  ? new URL(process.env.NEXT_PUBLIC_SERVER_URL)
  : null

// Uploads are served straight from the storage bucket's public host (see
// generateFileURL in payload.config.ts), which is a different origin again.
// Mirrors publicStorageBase() there — keep the two in step.
const storageHostname = (() => {
  try {
    if (process.env.S3_PUBLIC_URL) {
      return new URL(process.env.S3_PUBLIC_URL).hostname
    }

    const { S3_ENDPOINT: endpoint, S3_REGION: region, S3_BUCKET: bucket } = process.env

    // No custom endpoint means real AWS S3, which puts the bucket in the host.
    if (!endpoint) {
      return bucket && region ? `${bucket}.s3.${region}.amazonaws.com` : null
    }

    const ref = new URL(endpoint).hostname.split('.')[0]
    return ref ? `${ref}.supabase.co` : null
  } catch {
    return null
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Next fetches each source image once, re-encodes it to WebP at the size
    // actually displayed, and serves that from the CDN. Visitors stop pulling
    // multi-megabyte originals out of Supabase on every page view.
    formats: ['image/webp'],
    // How long an optimised image may be reused before Next re-encodes it, and
    // the max-age it sends to the browser when the source carries no cache
    // header of its own — which is every image here, whether it comes from
    // public/ or from the media bucket. The default is four hours, so a
    // returning visitor re-downloaded every image on the page twice a day.
    //
    // Thirty days rather than a year because these URLs are not content
    // addressed: /_next/image?url=%2Fgp-logo.webp stays the same string when
    // the file behind it changes. A year would mean an editor replacing a
    // photo in the admin, under the same filename, could not be sure it had
    // reached everyone for twelve months. A month is where the repeat-visit
    // benefit has essentially all arrived, and it bounds that staleness.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // 85 is visually indistinguishable from the original at display size;
    // Next 16 requires every quality used in a component to be declared here.
    qualities: [75, 85, 90],
    // Payload builds media URLs from serverURL, so they are absolute — and
    // Next treats every absolute URL as remote, even one pointing at the
    // deployment's own hostname. Without this the optimiser answers 400 and
    // every CMS image breaks, while relative-path images in public/ keep
    // working. Derived from the origin so a custom domain needs no edit here.
    remotePatterns: [
      ...(serverOrigin
        ? [{ protocol: serverOrigin.protocol.replace(':', ''), hostname: serverOrigin.hostname }]
        : []),
      ...(storageHostname ? [{ protocol: 'https', hostname: storageHostname }] : []),
    ],
  },
  // sharp is a native binary. Bundling it means tracing its dependency tree
  // correctly, which is exactly what failed; treating it as external leaves it
  // to be required from node_modules at runtime, as the platform intends.
  serverExternalPackages: ['sharp'],
  // The Supabase CA cert is read at runtime from a path supplied by an env
  // var, which file tracing cannot follow. Ship certs/ so DATABASE_CA_CERT
  // works on a serverless host; DATABASE_CA_CERT_VALUE needs none of this.
  outputFileTracingIncludes: {
    '/**': ['./certs/**'],
  },
}

export default withPayload(nextConfig)
