import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // The Supabase CA cert is read at runtime from a path supplied by an env
  // var, which file tracing cannot follow. Ship certs/ so DATABASE_CA_CERT
  // works on a serverless host; DATABASE_CA_CERT_VALUE needs none of this.
  outputFileTracingIncludes: {
    '/**': ['./certs/**'],
  },
}

export default withPayload(nextConfig)
