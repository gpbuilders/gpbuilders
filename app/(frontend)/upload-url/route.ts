import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import {
  ALLOWED_VIDEO_TYPES,
  bucket,
  json,
  requireUser,
  s3Client,
  safeName,
  STAGING_PREFIX,
} from '@/lib/direct-upload'

/**
 * Issues a short-lived URL the browser can PUT a video to, bypassing Amplify's
 * ~4.3MB request-body limit entirely.
 *
 * Videos only. Images have no need of this — the Media collection reduces them
 * to 2560px WebP regardless — and every extra file type allowed here is
 * another thing that can be written into the bucket.
 */
export const dynamic = 'force-dynamic'

// Long enough for a slow connection to finish a large file, short enough that
// a leaked URL is not a standing grant.
const EXPIRES_IN = 15 * 60

export async function POST(request: Request) {
  const { user } = await requireUser(request)
  if (!user) return json({ error: 'Not authorised.' }, 401)

  let body: { filename?: unknown; contentType?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Expected JSON.' }, 400)
  }

  const contentType = String(body.contentType ?? '')
  if (!ALLOWED_VIDEO_TYPES.includes(contentType)) {
    return json(
      { error: `Only ${ALLOWED_VIDEO_TYPES.join(' and ')} can be uploaded this way.` },
      415,
    )
  }

  // The key is server-chosen. If the client named it, a caller could overwrite
  // an existing object by asking for its key.
  const key = `${STAGING_PREFIX}${crypto.randomUUID()}-${safeName(String(body.filename ?? 'video'))}`

  const url = await getSignedUrl(
    s3Client(),
    new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType }),
    { expiresIn: EXPIRES_IN },
  )

  return json({ url, key, expiresIn: EXPIRES_IN })
}
