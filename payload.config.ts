import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Leads } from './collections/Leads'
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

// By default the adapter keeps serving uploads through Payload's own
// /api/media/file/... route and streams from the bucket behind it. That puts
// the app server in the path of every image request: slower, and images go
// down whenever the server does. The bucket is public, so hand out its URL
// directly instead and take the server out of the loop entirely.
//
// Returns a prefix that a filename can simply be appended to. The two providers
// put the bucket in different places, so it is folded in here rather than at the
// call site:
//
//   AWS S3    https://<bucket>.s3.<region>.amazonaws.com/<file>   bucket in host
//   Supabase  https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<file>
//
// S3_PUBLIC_URL wins when set and is taken as a complete base — that is the
// escape hatch for a CDN in front of the bucket, where the host is neither.
function publicStorageBase(bucket: string): string | undefined {
  if (process.env.S3_PUBLIC_URL) {
    return process.env.S3_PUBLIC_URL.replace(/\/$/, '')
  }

  const endpoint = process.env.S3_ENDPOINT
  const region = process.env.S3_REGION

  // No custom endpoint means real AWS S3.
  if (!endpoint) {
    return region ? `https://${bucket}.s3.${region}.amazonaws.com` : undefined
  }

  try {
    const { hostname } = new URL(endpoint)
    const [ref, storage] = hostname.split('.')
    if (storage !== 'storage') return undefined
    return `https://${ref}.supabase.co/storage/v1/object/public/${bucket}`
  } catch {
    return undefined
  }
}

const publicBase = s3Bucket ? publicStorageBase(s3Bucket) : undefined

const storagePlugins = s3Bucket
  ? [
      s3Storage({
        collections: {
          // Both options are per-collection, not top-level.
          // disablePayloadAccessControl is the one that stops Payload wrapping
          // every file in its own route; generateFileURL then decides what URL
          // is stored. Without the first, the second is ignored.
          media: publicBase
            ? {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename }: { filename: string }) =>
                  `${publicBase}/${filename}`,
              }
            : true,
        },
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
    // Resolved through the import map, which is why these are strings rather
    // than imports — run `pnpm generate:importmap` after changing them.
    components: {
      graphics: {
        Logo: '/components/payload/Logo#Logo',
        Icon: '/components/payload/Icon#Icon',
      },
      afterNavLinks: ['/components/payload/ViewSiteLink#ViewSiteLink'],
    },
  },
  collections: [Leads, Projects, Media, Users],
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
