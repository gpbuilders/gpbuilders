/**
 * Rendered under the collection list in the admin nav.
 *
 * Payload has no built-in way back to the site it manages, and the first
 * thing someone does after editing a project is go and look at it. Falls
 * back to the local server so this is not dead in development.
 */
export function ViewSiteLink() {
  const href = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--theme-elevation-150)',
        color: 'var(--theme-elevation-600)',
        textDecoration: 'none',
        fontSize: '0.875rem',
      }}
    >
      {/* aria-hidden: the link text already says what this is. */}
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      View site
    </a>
  )
}
