import Image from 'next/image'
import Link from 'next/link'

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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
              Architecture, interior design, and execution for luxury
              residential and commercial spaces. Quality at an affordable price.
            </p>
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
          <p className="text-sm text-muted/45">
            © {new Date().getFullYear()} GP Builders. All rights reserved.
          </p>
          <p className="text-sm font-medium text-accent">
            Quality at an Affordable Price
          </p>
        </div>
      </div>
    </footer>
  )
}
