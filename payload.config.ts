import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// `next build` runs with NODE_ENV=production, so only guard the actual server.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
const isProductionServer = process.env.NODE_ENV === 'production' && !isBuildPhase

// Supabase gives two connection strings. The Supavisor pooler is the right one
// for serving requests, but DDL — dev-mode `push` and `payload migrate` — has to
// run over the direct/session connection. Either falls back to the other so a
// single-URL setup still works.
const pooled = process.env.DATABASE_URI
const direct = process.env.DATABASE_URI_DIRECT
const needsDDL =
  process.env.NODE_ENV !== 'production' || process.env.PAYLOAD_MIGRATING === 'true'

const connectionString = (needsDDL ? direct || pooled : pooled || direct) || ''

// Supabase signs its Postgres certs with a private root CA ("Supabase Root 2021
// CA") that Node does not ship, so the default chain check fails. Download it
// from Settings → Database → SSL Configuration and supply it one of two ways:
//
//   DATABASE_CA_CERT_VALUE  the PEM inline, raw or base64. Use this in
//                           production — bundlers do not reliably ship loose
//                           files, and there is no path left to resolve wrong.
//   DATABASE_CA_CERT        a path relative to the project root. Convenient
//                           locally, where the repo layout is right there.
function readCaCert(): string | undefined {
  const inline = process.env.DATABASE_CA_CERT_VALUE?.trim()

  if (inline) {
    return inline.startsWith('-----BEGIN')
      ? inline
      : Buffer.from(inline, 'base64').toString('utf8')
  }

  const certPath = process.env.DATABASE_CA_CERT
  if (!certPath) {
    return undefined
  }

  // Resolve from cwd, not from this file — once bundled, this module can sit
  // several directories deep inside .next/server.
  const resolved = path.resolve(process.cwd(), certPath)

  try {
    return readFileSync(resolved, 'utf8')
  } catch {
    throw new Error(
      `DATABASE_CA_CERT points at ${resolved}, which could not be read. ` +
        'Use DATABASE_CA_CERT_VALUE to pass the certificate inline instead.',
    )
  }
}

const ca = readCaCert()

// DATABASE_SSL_INSECURE encrypts without authenticating the server — acceptable
// locally, never in production.
const ssl = ca
  ? { ca }
  : process.env.DATABASE_SSL_INSECURE === 'true'
    ? { rejectUnauthorized: false }
    : undefined

if (!ca && isProductionServer) {
  throw new Error(
    'A Supabase CA certificate is required in production. Set DATABASE_CA_CERT_VALUE ' +
      '(inline PEM) or DATABASE_CA_CERT (file path). Download it from Settings → ' +
      'Database → SSL Configuration.',
  )
}

// Uploads have to leave the local filesystem before this deploys anywhere with
// ephemeral storage. The adapter turns itself on once a bucket is configured,
// so local development keeps writing to public/media with no S3 account.
const s3Bucket = process.env.S3_BUCKET

if (!s3Bucket && isProductionServer) {
  throw new Error(
    'S3_BUCKET is required in production. Without it uploads would be written to a ' +
      'filesystem that is not served and does not survive a deploy.',
  )
}

const storagePlugins = s3Bucket
  ? [
      s3Storage({
        collections: { media: true },
        bucket: s3Bucket,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          // Supabase Storage addresses buckets by path, not by subdomain.
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
        },
      }),
    ]
  : []

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL

export default buildConfig({
  serverURL,
  // Payload defaults to allowing nothing; list the one origin that serves it.
  cors: serverURL ? [serverURL] : [],
  csrf: serverURL ? [serverURL] : [],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— GP Builders',
    },
  },
  collections: [Projects, Media, Users],
  editor: lexicalEditor(),
  plugins: storagePlugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString, ssl },
    // Supabase will not grant CREATE DATABASE; fail loudly on a bad URL
    // instead of falling into the adapter's create-and-retry path.
    disableCreateDatabase: true,
    // Auto-sync the schema in dev, migrations everywhere else.
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
})
