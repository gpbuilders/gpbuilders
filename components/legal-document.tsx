import Link from 'next/link'

import { LegalContents } from '@/components/legal-contents'

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
    <section className="w-full bg-background pt-14 pb-20 lg:pt-20 lg:pb-28">
      {/* 72rem is not arbitrary: it is exactly what the two columns need —
          16rem of index, a 4rem gutter, a 48rem measure for the clauses, and
          the 2rem page padding either side. Sized this way the grid fills its
          container, so the document sits centred under the hero instead of
          hugging the left with a bank of dead space down the right.
          The tracks stay fixed rather than fractional. A 1fr text column in a
          wider container would stretch to well over a thousand pixels, which
          is far too long a line to read comfortably. */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,48rem)] lg:gap-16">
          {/* Sticky on desktop so the clause numbers stay reachable through a
              long document; a plain list there, but kept as a bordered card on
              narrow screens where it sits inline above the text and needs an
              edge to separate it. Only the id and heading are handed over, so
              the clause bodies never have to cross into client code. */}
          <LegalContents
            sections={sections.map(({ id, heading }) => ({ id, heading }))}
          />

          {/* min-w-0 so a long unbroken string in a clause cannot widen the
              grid track and push the page into a horizontal scroll. */}
          <div className="mt-12 min-w-0 lg:mt-0">
            <p className="text-sm text-muted-foreground">
              Last updated{' '}
              <time dateTime={updated.iso} className="font-medium text-foreground">
                {updated.label}
              </time>
            </p>

            <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
              {intro}
            </div>

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
        </div>
      </div>
    </section>
  )
}

/** A defined term, used consistently across both documents. */
export function Term({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}
