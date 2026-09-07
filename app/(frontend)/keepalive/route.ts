import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Keeps the Supabase project awake, and doubles as an uptime check.
 *
 * The free tier pauses a project after a stretch of inactivity, and this site
 * is statically generated — pages are built once and served from the CDN, so
 * the database can genuinely go untouched for days. A scheduled request here
 * every 12 hours is enough to count as activity.
 *
 * Deliberately narrow: it answers "did Postgres respond?" and nothing else.
 * Its predecessor at /health reported the Node version, working directory and
 * the whole environment-variable inventory, which was the right shape for
 * diagnosing one outage and the wrong shape for a permanently public endpoint.
 *
 * Returns 503 on failure rather than a 200 carrying bad news, so a scheduler
 * or uptime monitor raises it. A keep-alive that fails silently for weeks is
 * worse than none: you would believe the project was being kept awake while
 * it quietly paused.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const started = Date.now()

  try {
    const payload = await getPayload({ config })
    // The cheapest query that still proves a real round trip to Postgres.
    const { totalDocs } = await payload.count({ collection: 'projects' })

    return Response.json(
      { ok: true, projects: totalDocs, ms: Date.now() - started },
      { headers: { 'cache-control': 'no-store' } },
    )
  } catch (error) {
    console.error('keepalive: database unreachable', error)

    // No error detail in the body — whoever polls this does not need it, and
    // it would be public. The log above carries the cause.
    return Response.json(
      { ok: false, ms: Date.now() - started },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    )
  }
}
