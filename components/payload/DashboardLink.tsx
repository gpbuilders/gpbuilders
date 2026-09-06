'use client'

import { usePathname } from 'next/navigation'

/**
 * A Dashboard entry at the top of the admin nav.
 *
 * Payload only routes to the dashboard through the logo in the nav header,
 * which is not obvious — once inside a collection there is no visible way
 * back. Reuses Payload's own .nav__link so it inherits the panel's spacing
 * and picks up the brand colour applied in custom.css.
 */
export function DashboardLink() {
  const pathname = usePathname()

  // Exact match only: /admin/collections/... is a collection, not the dashboard.
  const isDashboard = pathname === '/admin' || pathname === '/admin/'

  return (
    <a
      href="/admin"
      className={`nav__link${isDashboard ? ' active' : ''}`}
      aria-current={isDashboard ? 'page' : undefined}
      style={{ gap: '0.5rem', marginBottom: '0.5rem' }}
    >
      <svg
        aria-hidden="true"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
      Dashboard
    </a>
  )
}
