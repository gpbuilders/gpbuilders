import { S3Client } from '@aws-sdk/client-s3'
import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Shared pieces for uploading a file straight from the browser to S3.
 *
 * Amplify rejects any request body over roughly 4.3MB before it reaches the
 * application — measured, not assumed: 4.25MB is accepted and 4.50MB comes
 * back as a bare 413. For images that ceiling is academic, because the Media
 * collection caps every upload at 2560px and re-encodes it to WebP anyway, so
 * shrinking in the browser produces the same stored file. Video has no such
 * server-side reduction, so a hero video over 4.3MB simply cannot be uploaded
 * through the normal path — which is what this exists to solve.
 *
 * The file goes browser -> S3 directly, and only its key comes back through
 * Amplify. The finalise step then reads it from S3 server-side, where the
 * request-body limit does not apply.
 */

/** Where browser-uploaded files land before they become real records. */
export const STAGING_PREFIX = 'staging/'

/** Below this, the normal upload path works and is simpler. */
export const DIRECT_UPLOAD_THRESHOLD = 3.5 * 1024 * 1024

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

export function s3Client(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  })
}

export const bucket = () => process.env.S3_BUCKET || ''

export const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/**
 * These routes hand out write access to the bucket, so both of them are for
 * logged-in editors only. The admin sends its session cookie with every fetch,
 * which is what payload.auth reads.
 */
export async function requireUser(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  return { payload, user }
}

/**
 * Strips anything that could escape the staging prefix or confuse S3. Keeps
 * the extension, because the finalise step uses it to name the final object.
 */
export function safeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'upload'
  return base.replace(/[^A-Za-z0-9._-]/g, '-').replace(/-{2,}/g, '-').slice(0, 180)
}
