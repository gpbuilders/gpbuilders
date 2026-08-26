import { withPayload } from '@payloadcms/next/withPayload'

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
    // 85 is visually indistinguishable from the original at display size;
    // Next 16 requires every quality used in a component to be declared here.
    qualities: [75, 85, 90],
    // Uploads are served from Supabase Storage once S3_BUCKET is set.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tqadsrlufzitgfzilhya.storage.supabase.co',
      },
    ],
  },
  // The Supabase CA cert is read at runtime from a path supplied by an env
  // var, which file tracing cannot follow. Ship certs/ so DATABASE_CA_CERT
  // works on a serverless host; DATABASE_CA_CERT_VALUE needs none of this.
  outputFileTracingIncludes: {
    '/**': ['./certs/**'],
  },
}

export default withPayload(nextConfig)
