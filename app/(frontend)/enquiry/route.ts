import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Records a contact-form submission as an Enquiry.
 *
 * This was a server action until it turned out server actions do not run on
 * this deployment: every invocation returned a 500 with the same error digest,
 * on the custom domain and the raw amplifyapp domain alike, and the leads
 * table stayed empty. Route handlers on the same deployment work — /keepalive
 * does the identical getPayload-then-query and answers 200 every time — so
 * this uses the mechanism that demonstrably works here.
 *
 * Not under /api: Payload's catch-all owns that path.
 *
 * The move costs the one thing the server action gave for free — there is now
 * a public endpoint that writes to the database. The Leads collection still
 * denies unauthenticated creation, so REST is closed; this route is the only
 * way in, and it validates before writing. See the origin check below.
 */

// A write must never be served from a cache, and must not be statically
// analysed into one at build time.
export const dynamic = 'force-dynamic'

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

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

/**
 * Rejects a cross-site post. Not a security boundary on its own — anything
 * that is not a browser can send whatever Origin it likes — but it costs one
 * comparison and stops a form on someone else's page writing to this table.
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // same-origin form posts may omit it

  const allowed = [process.env.NEXT_PUBLIC_SERVER_URL, request.headers.get('host')]
    .filter(Boolean)
    .map((value) => {
      try {
        return new URL(value!.includes('://') ? value! : `https://${value}`).host
      } catch {
        return null
      }
    })

  try {
    return allowed.includes(new URL(origin).host)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json({ ok: false, error: 'Request rejected.' }, 403)
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return json({ ok: false, error: 'That submission could not be read.' }, 400)
  }

  // Honeypot: a field hidden from people but filled in by naive bots. Answer
  // as though it succeeded so the bot has nothing to learn from the response.
  if (clean(formData.get('company'), 100)) {
    return json({ ok: true })
  }

  const name = clean(formData.get('name'), MAX.name)
  const email = clean(formData.get('email'), MAX.email)
  const message = clean(formData.get('message'), MAX.message)

  if (!name || !email || !message) {
    return json(
      { ok: false, error: 'Please fill in your name, email and message.' },
      400,
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'That email address does not look right.' }, 400)
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

    return json({ ok: true })
  } catch (error) {
    // The visitor cannot act on a database error, and it must not leak out.
    console.error('Failed to record enquiry:', error)
    return json(
      {
        ok: false,
        error:
          'Something went wrong sending that. Please try again, or email us directly.',
      },
      500,
    )
  }
}
