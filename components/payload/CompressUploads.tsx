'use client'

import { useEffect } from 'react'

/**
 * Shrinks oversized images in the browser before they are uploaded.
 *
 * Amplify rejects any request body over roughly 4.3MB with a bare 413, before
 * it reaches the application — so nothing server-side can raise that ceiling,
 * and a photo straight off a phone (commonly 4-8MB) simply fails with an error
 * the client cannot act on. Measured: 4.25MB accepted, 4.50MB rejected.
 *
 * This wraps fetch rather than the file input. Payload's admin sends every
 * request through fetch (see @payloadcms/ui utilities/api), so a single hook
 * covers the file picker, drag-and-drop and paste alike, where intercepting
 * the input element would miss the last two.
 *
 * Deliberately conservative:
 *   - only images, and never SVG — vectors do not survive a canvas round-trip
 *   - only files that would actually fail, so nothing small is re-encoded and
 *     degraded for no reason
 *   - any failure falls through to the original file, so the worst case is the
 *     413 that would have happened anyway
 */

// Amplify's ceiling is ~4.3MB. Leave room for the multipart envelope and the
// other form fields travelling with the file.
const MAX_BYTES = 3.5 * 1024 * 1024

// Matches resizeOptions in collections/Media.ts — the server caps at 2560
// anyway, so anything above it is bytes uploaded only to be thrown away.
const MAX_EDGE = 2560

const QUALITY_STEPS = [0.9, 0.82, 0.74, 0.66, 0.58]

async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('no 2d context')
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // Step the quality down only as far as needed; stop at the first size that
  // will get through rather than compressing everything to the floor.
  for (const quality of QUALITY_STEPS) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )
    if (!blob) continue
    if (blob.size <= MAX_BYTES || quality === QUALITY_STEPS[QUALITY_STEPS.length - 1]) {
      const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
      return new File([blob], name, { type: 'image/webp', lastModified: file.lastModified })
    }
  }

  return file
}

/** Rewrites the file entries of a FormData, leaving every other field alone. */
async function shrinkFormData(form: FormData): Promise<FormData | null> {
  let changed = false
  const next = new FormData()

  for (const [key, value] of form.entries()) {
    const isBigImage =
      value instanceof File &&
      value.type.startsWith('image/') &&
      value.type !== 'image/svg+xml' &&
      value.size > MAX_BYTES

    if (!isBigImage) {
      next.append(key, value as string | Blob)
      continue
    }

    const original = value as File
    try {
      const smaller = await shrink(original)
      // Only take it if it actually helped.
      if (smaller.size < original.size) {
        // eslint-disable-next-line no-console
        console.info(
          `[upload] ${original.name}: ${(original.size / 1024 / 1024).toFixed(1)}MB → ` +
            `${(smaller.size / 1024 / 1024).toFixed(1)}MB before upload`,
        )
        next.append(key, smaller)
        changed = true
        continue
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[upload] could not compress, sending as-is:', error)
    }

    next.append(key, original)
  }

  return changed ? next : null
}

const VIDEO_TYPES = ['video/mp4', 'video/webm']

/**
 * Sends a video straight to S3 and asks the server to turn it into a record.
 *
 * Only the object key travels through Amplify afterwards, so the request-body
 * limit never applies to the file itself. Returns Payload's own create
 * response shape so the admin cannot tell the difference.
 */
async function relayVideo(file: File, form: FormData, fetchFn: typeof window.fetch) {
  const ticket = await fetchFn('/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  })
  if (!ticket.ok) throw new Error(`could not get an upload URL (${ticket.status})`)
  const { url, key } = (await ticket.json()) as { url: string; key: string }

  const put = await fetchFn(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!put.ok) throw new Error(`S3 rejected the upload (${put.status})`)

  // Carry the caption the editor typed, which rides along in _payload.
  let caption: string | undefined
  const meta = form.get('_payload')
  if (typeof meta === 'string') {
    try {
      caption = (JSON.parse(meta) as { caption?: string }).caption
    } catch {
      /* the form had no usable JSON; the caption is optional */
    }
  }

  return fetchFn('/upload-finalise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ key, filename: file.name, contentType: file.type, caption }),
  })
}

export function CompressUploads({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    const original = window.fetch
    // React strict mode mounts effects twice; wrapping a wrapper would mean
    // compressing an already-compressed file.
    if ((original as { __compressed?: boolean }).__compressed) return

    const patched: typeof window.fetch = async (input, init) => {
      const body = init?.body
      if (!(body instanceof FormData)) return original(input, init)

      // A video too large for Amplify goes to S3 directly instead. Anything
      // that fails here falls back to the normal request, which will produce
      // the same 413 it would have without this — no worse than before.
      const video = [...body.values()].find(
        (v): v is File =>
          v instanceof File && VIDEO_TYPES.includes(v.type) && v.size > MAX_BYTES,
      )
      if (video) {
        try {
          return await relayVideo(video, body, original)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('[upload] direct upload failed, falling back:', error)
        }
      }

      const next = await shrinkFormData(body)
      return original(input, next ? { ...init, body: next } : init)
    }

    ;(patched as { __compressed?: boolean }).__compressed = true
    window.fetch = patched

    return () => {
      window.fetch = original
    }
  }, [])

  return <>{children}</>
}
