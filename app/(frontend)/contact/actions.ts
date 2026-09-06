'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export type SubmitResult = { ok: true } | { ok: false; error: string }

const MAX = { name: 120, email: 200, phone: 40, message: 4000, project: 200 }

const clean = (value: FormDataEntryValue | null, limit: number) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : ''

const PROJECT_TYPES = [
  'residential',
  'commercial',
  'interiors',
  'landscape',
  'consultation',
]

/**
 * Records a contact-form submission as an Enquiry.
 *
 * A server action rather than a route handler: Payload's catch-all already
 * owns /api/*, and this keeps the write on the server with no public endpoint
 * for anyone to post to directly. The Leads collection denies unauthenticated
 * creation for exactly that reason — the Local API call below is the only way
 * in, and it validates first.
 */
export async function submitLead(formData: FormData): Promise<SubmitResult> {
  // Honeypot: a field hidden from people but filled in by naive bots. Answer
  // as though it succeeded so the bot has nothing to learn from the response.
  if (clean(formData.get('company'), 100)) {
    return { ok: true }
  }

  const name = clean(formData.get('name'), MAX.name)
  const email = clean(formData.get('email'), MAX.email)
  const message = clean(formData.get('message'), MAX.message)

  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in your name, email and message.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right.' }
  }

  const projectType = clean(formData.get('projectType'), 40)

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      data: {
        name,
        email,
        message,
        phone: clean(formData.get('phone'), MAX.phone) || undefined,
        // Only ever store a value the collection actually offers, rather than
        // whatever arrived in the request.
        projectType: PROJECT_TYPES.includes(projectType)
          ? (projectType as 'residential')
          : undefined,
        project: clean(formData.get('project'), MAX.project) || undefined,
        status: 'new',
      },
    })
    return { ok: true }
  } catch (error) {
    // The visitor cannot act on a database error, and it must not leak out.
    console.error('Failed to record enquiry:', error)
    return {
      ok: false,
      error: 'Something went wrong sending that. Please try again, or email us directly.',
    }
  }
}
