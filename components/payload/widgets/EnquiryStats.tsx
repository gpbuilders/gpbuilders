import config from '@payload-config'
import { getPayload } from 'payload'

/** Mirrors the status options in collections/Leads.ts. */
const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'closed', label: 'Closed' },
] as const

/**
 * Enquiry counts by status.
 *
 * Only New carries the accent, and only when it is above zero: an unanswered
 * enquiry is the one thing needing action today. If every card were coloured
 * none of them would mean anything.
 */
export async function EnquiryStats() {
  try {
    const payload = await getPayload({ config })
    const counts = await Promise.all(
      STATUSES.map(({ value }) =>
        payload.count({ collection: 'leads', where: { status: { equals: value } } }),
      ),
    )
    const total = counts.reduce((n, c) => n + c.totalDocs, 0)

    if (total === 0) {
      return (
        <div className="gp-widget gp-widget--empty">
          No enquiries yet. They will appear here as the contact form is used.
        </div>
      )
    }

    return (
      <div className="gp-widget">
        <h2 className="gp-widget__title">Enquiries by status</h2>
        <div className="gp-stats">
          {STATUSES.map(({ value, label }, i) => {
            const count = counts[i].totalDocs
            return (
              <a
                key={value}
                href={`/admin/collections/leads?where[status][equals]=${value}`}
                className={[
                  'gp-stat',
                  value === 'new' && count > 0 ? 'gp-stat--attention' : '',
                  count === 0 ? 'gp-stat--zero' : '',
                ].filter(Boolean).join(' ')}
              >
                <span className="gp-stat__count">{count}</span>
                <span className="gp-stat__label">{label}</span>
              </a>
            )
          })}
        </div>
      </div>
    )
  } catch {
    return null
  }
}
