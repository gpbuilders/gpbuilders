import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
// CA") that Node does not ship, so the default chain check fails. Point
// DATABASE_CA_CERT at the cert downloaded from Settings → Database → SSL
// Configuration to get real verification. DATABASE_SSL_INSECURE encrypts
// without authenticating the server — acceptable locally, never in production.
const caCertPath = process.env.DATABASE_CA_CERT

const ssl = caCertPath
  ? { ca: readFileSync(path.resolve(dirname, caCertPath), 'utf8') }
  : process.env.DATABASE_SSL_INSECURE === 'true'
    ? { rejectUnauthorized: false }
    : undefined

// `next build` runs with NODE_ENV=production, so only guard the actual server.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

if (!caCertPath && process.env.NODE_ENV === 'production' && !isBuildPhase) {
  throw new Error(
    'DATABASE_CA_CERT is required in production. Download the Supabase CA cert from Settings → Database → SSL Configuration.',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— GP Builders',
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
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
