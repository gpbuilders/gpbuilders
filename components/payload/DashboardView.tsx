import config from '@payload-config'
import { getPayload } from 'payload'

const STATUSES = [
  { value: 'new', label: 'New', live: true },
  { value: 'contacted', label: 'Contacted', live: true },
  { value: 'quoted', label: 'Quoted', live: true },
  { value: 'won', label: 'Won', live: false },
  { value: 'closed', label: 'Closed', live: false },
] as const

const leadsHref = (status?: string) =>
  status
    ? `/admin/collections/leads?where[status][equals]=${status}`
    : '/admin/collections/leads'

/**
 * Replaces Payload's default dashboard.
 *
 * The composition is the point: a KPI strip to land on, a pipeline that shows
 * the shape of the funnel at a glance, then a queue of enquiries nobody has
 * answered. Payload's widget grid could render the same three blocks but not
 * guarantee that order or those widths, which is why the view is replaced
 * rather than assembled from widgets.
 */
export async function DashboardView() {
  const payload = await getPayload({ config })

  const [statusCounts, projects, featured, mediaPage, unanswered] = await Promise.all([
    Promise.all(
      STATUSES.map(({ value }) =>
        payload.count({ collection: 'leads', where: { status: { equals: value } } }),
      ),
    ),
    payload.count({ collection: 'projects' }),
    payload.count({ collection: 'projects', where: { featured: { equals: true } } }),
    // Enough to size the library on a site this scale; the count is authoritative.
    payload.find({ collection: 'media', limit: 1000, depth: 0 }),
    payload.find({
      collection: 'leads',
      where: { status: { in: ['new', 'contacted'] } },
      // Oldest first: the enquiry waiting longest is the one to answer next.
      sort: 'createdAt',
      limit: 6,
      depth: 0,
    }),
  ])

  const counts = Object.fromEntries(
    STATUSES.map(({ value }, i) => [value, statusCounts[i].totalDocs]),
  ) as Record<string, number>

  const totalLeads = Object.values(counts).reduce((n, v) => n + v, 0)
  const mediaBytes = mediaPage.docs.reduce((n, d) => n + (d.filesize ?? 0), 0)
  const mediaMB = (mediaBytes / 1048576).toFixed(1)

  // Bars share one scale so their lengths are comparable, not each self-relative.
  const peak = Math.max(1, ...Object.values(counts))

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="gp-dash">
      <header className="gp-dash__head">
        <h1>Dashboard</h1>
        <span className="gp-dash__date">{today}</span>
      </header>

      {/* --- KPI strip --- */}
      <div className="gp-kpis">
        <a className="gp-kpi gp-kpi--lead" href={leadsHref()}>
          <span className="gp-kpi__label">Enquiries</span>
          <span className="gp-kpi__n">{totalLeads}</span>
          <span className="gp-kpi__sub">All time</span>
        </a>
        <a className="gp-kpi" href={leadsHref('new')}>
          <span className="gp-kpi__label">New</span>
          <span className="gp-kpi__n">{counts.new}</span>
          <span className="gp-kpi__sub">Awaiting reply</span>
        </a>
        <a className="gp-kpi" href={leadsHref('contacted')}>
          <span className="gp-kpi__label">Contacted</span>
          <span className="gp-kpi__n">{counts.contacted}</span>
          <span className="gp-kpi__sub">In progress</span>
        </a>
        <a className="gp-kpi" href={leadsHref('quoted')}>
          <span className="gp-kpi__label">Quoted</span>
          <span className="gp-kpi__n">{counts.quoted}</span>
          <span className="gp-kpi__sub">Awaiting decision</span>
        </a>
        <a className="gp-kpi" href="/admin/collections/projects">
          <span className="gp-kpi__label">Projects</span>
          <span className="gp-kpi__n">{projects.totalDocs}</span>
          <span className="gp-kpi__sub">{featured.totalDocs} featured</span>
        </a>
        <a className="gp-kpi" href="/admin/collections/media">
          <span className="gp-kpi__label">Images</span>
          <span className="gp-kpi__n">{mediaPage.totalDocs}</span>
          <span className="gp-kpi__sub">{mediaMB} MB</span>
        </a>
      </div>

      {/* --- pipeline --- */}
      <section className="gp-panel">
        <h2 className="gp-panel__h">Enquiry pipeline</h2>
        {totalLeads === 0 ? (
          <p className="gp-empty">
            No enquiries yet. They will appear here as the contact form is used.
          </p>
        ) : (
          <div className="gp-pipe">
            {STATUSES.map(({ value, label, live }) => {
              const n = counts[value]
              const pct = totalLeads ? Math.round((n / totalLeads) * 100) : 0
              return (
                <a key={value} className="gp-pipe__row" href={leadsHref(value)}>
                  <span className="gp-pipe__label">{label}</span>
                  <span className="gp-pipe__track">
                    <span
                      className={`gp-pipe__fill${live ? '' : ' gp-pipe__fill--done'}`}
                      // Minimum 2% so a zero still reads as a bar at rest
                      // rather than an empty track that looks broken.
                      style={{ width: `${Math.max(2, (n / peak) * 100)}%` }}
                    />
                  </span>
                  <span className="gp-pipe__n">{n}</span>
                  <span className="gp-pipe__pct">{pct}%</span>
                </a>
              )
            })}
          </div>
        )}
      </section>

      {/* --- work queue --- */}
      <section className="gp-panel">
        <h2 className="gp-panel__h">
          Needs a reply
          {unanswered.totalDocs > 0 && (
            <span className="gp-panel__count">{unanswered.totalDocs}</span>
          )}
        </h2>
        {unanswered.docs.length === 0 ? (
          <p className="gp-empty">Nothing outstanding — every enquiry has been dealt with.</p>
        ) : (
          <>
            <ul className="gp-queue">
              {unanswered.docs.map((d) => {
                const days = Math.floor(
                  (Date.now() - new Date(d.createdAt).getTime()) / 86_400_000,
                )
                return (
                  <li key={d.id}>
                    <a className="gp-queue__row" href={`/admin/collections/leads/${d.id}`}>
                      <span className="gp-queue__main">
                        <span className="gp-queue__name">{d.name}</span>
                        <span className="gp-queue__meta">
                          {d.email}
                          {d.project ? ` · ${d.project}` : ''}
                        </span>
                      </span>
                      <span className="gp-queue__right">
                        <span className={`gp-chip gp-chip--${d.status}`}>
                          {STATUSES.find((s) => s.value === d.status)?.label ?? d.status}
                        </span>
                        <span className="gp-queue__age">
                          {days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`}
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <a className="gp-panel__more" href={leadsHref()}>
              All enquiries →
            </a>
          </>
        )}
      </section>
    </div>
  )
}
