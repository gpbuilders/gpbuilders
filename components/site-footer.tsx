import Image from 'next/image'
import Link from 'next/link'

/**
 * lucide-react dropped its brand icons in v1, so this is the Instagram mark
 * drawn to the same conventions as the lucide icons used elsewhere — 24px
 * box, 2px stroke, round caps — so it sits consistently beside them.
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

// An array rather than one hardcoded anchor, so a second profile is a row
// here instead of a copied block of markup.
const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    // Share-sheet URLs carry a `stkn` token and utm parameters. The token is
    // tied to whoever generated the link and does not belong in published
    // markup; the profile URL alone is what is stable and canonical.
    href: 'https://www.instagram.com/gp_builders_trichy',
    Icon: InstagramIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vignesh-chandrasekaran-8b432843a',
    Icon: LinkedInIcon,
  },
]

const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Process', href: '/services' },
      { label: 'Milestones', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Architecture + Interior', href: '/services' },
      { label: 'Interior + Construction', href: '/services' },
      { label: 'Construction Only', href: '/services' },
      { label: 'Landscape Design', href: '/services' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { label: 'Residential', href: '/projects' },
      { label: 'Commercial', href: '/projects' },
      { label: 'Start a Project', href: '/contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-dark-bg-deep">
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/gp-logo.png"
                alt="GP Builders logo"
                width={44}
                height={44}
                className="h-10 w-10 object-contain"
              />
              <span className="font-serif text-lg font-semibold text-muted">
                GP Builders
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-pretty text-sm font-light leading-relaxed text-muted/75">
              Architecture, interior design, and construction for luxury
              residential and commercial spaces. Quality at an affordable price.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    // The icon carries no text, so the link needs its own name.
                    aria-label={`GP Builders on ${label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-muted/15 text-muted/75 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-muted">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted/75 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-muted/10 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
            <p className="text-sm text-muted/45">
              © {new Date().getFullYear()} GP Builders. All rights reserved.
            </p>
            <span aria-hidden className="hidden text-muted/25 sm:inline">
              &middot;
            </span>
            <p className="text-sm text-muted/45">
              Crafted by{' '}
              <a
                href="https://spatialcontinuum.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-muted/70 underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Spatial Continuum
              </a>
            </p>
          </div>
          <p className="text-sm font-medium text-accent">
            Quality at an Affordable Price
          </p>
        </div>
      </div>
    </footer>
  )
}
