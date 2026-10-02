import Link from 'next/link'

/**
 * The shell both legal pages share.
 *
 * A legal document genuinely is an ordered sequence — clauses are referred to
 * by number in correspondence and in any dispute — so the numbering here is
 * carrying information rather than decorating the page. The contents list is
 * built from the same array that renders the sections, so a clause cannot be
 * listed and then missing, or renumbered in one place only.
 */
export type LegalSection = {
  /** Anchor, so a specific clause can be linked to directly. */
  id: string
  heading: string
  body: React.ReactNode
}

export function LegalDocument({
  updated,
  intro,
  sections,
}: {
  /** Shown to the reader and machine-readable for `datetime`. */
  updated: { label: string; iso: string }
  intro: React.ReactNode
  sections: LegalSection[]
}) {
  return (
    <section className="w-full bg-background pb-20 lg:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Last updated{' '}
          <time dateTime={updated.iso} className="font-medium text-foreground">
            {updated.label}
          </time>
        </p>

        <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
          {intro}
        </div>

        <nav aria-label="Contents" className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Contents
          </h2>
          <ol className="mt-4 space-y-2">
            {sections.map((section, index) => (
              <li key={section.id} className="flex gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 tabular-nums text-muted-foreground/60"
                >
                  {index + 1}.
                </span>
                <a
                  href={`#${section.id}`}
                  className="rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 space-y-12">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-serif text-2xl font-semibold leading-snug text-foreground">
                <span aria-hidden="true" className="mr-3 tabular-nums text-primary">
                  {index + 1}.
                </span>
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-pretty leading-relaxed text-muted-foreground">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Questions about this page? Write to{' '}
            <a
              href="mailto:projects@gpbuildersgroup.com"
              className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              projects@gpbuildersgroup.com
            </a>{' '}
            or see the{' '}
            <Link
              href="/contact"
              className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

/** A defined term, used consistently across both documents. */
export function Term({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}
