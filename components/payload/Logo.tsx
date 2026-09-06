/**
 * Shown on the admin login screen, in place of Payload's own wordmark.
 *
 * Colours come from Payload's theme tokens rather than literals so this
 * follows the panel into dark mode. Plain <img> rather than next/image: the
 * admin is outside the site's image pipeline and this is a 24KB PNG already.
 */
export function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <img
        src="/icons/favicon-192x192.png"
        alt=""
        width={88}
        height={88}
        style={{ display: 'block' }}
      />
      <span
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--theme-elevation-800)',
        }}
      >
        GP Builders
      </span>
      <span
        style={{
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--theme-elevation-500)',
        }}
      >
        Quality. Affordable.
      </span>
    </div>
  )
}
