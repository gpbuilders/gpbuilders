import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

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
 * Turns a staged object into a real Videos record.
 *
 * The browser has already PUT the file to S3, so only its key travels through
 * Amplify — a few hundred bytes rather than the whole video, which is what
 * sidesteps the request-body limit. Here the file is read back from S3 and
 * handed to Payload's normal create, so the record, the stored object and the
 * URL are produced by the same code path as any other upload. Nothing about
 * the collection needs to know this route exists.
 *
 * Responds in Payload's REST create shape ({ doc, message }, 201) so the admin
 * can treat the answer as though it came from /api/videos.
 */
export const dynamic = 'force-dynamic'

// The staged object is read into memory to hand to Payload. That memory, not
// the request body, is now the practical ceiling — far above the 4.3MB this
// exists to escape, but not unlimited.
const MAX_BYTES = 200 * 1024 * 1024

export async function POST(request: Request) {
  const { payload, user } = await requireUser(request)
  if (!user) return json({ error: 'Not authorised.' }, 401)

  let body: { key?: unknown; filename?: unknown; contentType?: unknown; caption?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Expected JSON.' }, 400)
  }

  const key = String(body.key ?? '')
  // Only ever read back from the staging area, and never up out of it.
  if (!key.startsWith(STAGING_PREFIX) || key.includes('..')) {
    return json({ error: 'Unknown upload.' }, 400)
  }

  const contentType = String(body.contentType ?? '')
  if (!ALLOWED_VIDEO_TYPES.includes(contentType)) {
    return json({ error: 'Unsupported file type.' }, 415)
  }

  const s3 = s3Client()

  // Check the size before reading, so an oversized object is rejected rather
  // than pulled into memory first.
  let size: number
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket(), Key: key }))
    size = head.ContentLength ?? 0
  } catch {
    return json({ error: 'That upload could not be found. Please try again.' }, 404)
  }

  if (size > MAX_BYTES) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key })).catch(() => {})
    return json(
      { error: `That file is ${(size / 1024 / 1024).toFixed(0)}MB. The limit is ${MAX_BYTES / 1024 / 1024}MB.` },
      413,
    )
  }

  try {
    const object = await s3.send(new GetObjectCommand({ Bucket: bucket(), Key: key }))
    const chunks: Buffer[] = []
    for await (const chunk of object.Body as AsyncIterable<Buffer>) chunks.push(chunk)
    const data = Buffer.concat(chunks)

    const name = safeName(String(body.filename ?? 'video.mp4'))
    const caption = typeof body.caption === 'string' ? body.caption.trim().slice(0, 300) : undefined

    const doc = await payload.create({
      collection: 'videos',
      data: caption ? { caption } : {},
      file: { data, mimetype: contentType, name, size: data.byteLength },
      // The session was already verified above; this is the same trust level
      // as the admin's own request.
      overrideAccess: true,
    })

    // The staged copy has served its purpose. A failure here leaves an orphan
    // rather than losing the upload, so it must not fail the request.
    await s3.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key })).catch((error) => {
      payload.logger.warn(`Could not remove staged upload ${key}: ${error}`)
    })

    return json({ doc, message: 'Successfully created.' }, 201)
  } catch (error) {
    payload.logger.error(`Failed to finalise upload ${key}: ${error}`)
    return json({ error: 'That video could not be saved. Please try again.' }, 500)
  }
}
