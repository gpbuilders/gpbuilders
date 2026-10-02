'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The contents index, with the clause being read marked as you scroll.
 *
 * Split out of LegalDocument so that this is the only part of a legal page
 * shipped to the browser as JavaScript — the clauses themselves stay server
 * rendered, which is what a document that must be readable and indexable
 * wants.
 *
 * Only the id and heading cross the boundary, so nothing here needs the
 * clause bodies to be serializable.
 */
export function LegalContents({
  sections,
}: {
  sections: { id: string; heading: string }[]
}) {
  const [active, setActive] = useState<string | null>(null)
  // Which clauses are currently inside the band, kept outside React state:
  // the observer fires per-element and we need the whole picture to decide,
  // but a Set changing is not something to re-render on.
  const inBand = useRef<Set<string>>(new Set())

  // The ids, as a primitive, so the effect does not re-run on every render
  // just because the parent built a new array literal.
  const key = sections.map((section) => section.id).join('|')

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.current.add(entry.target.id)
          else inBand.current.delete(entry.target.id)
        }

        // The topmost clause in the band wins. When nothing is in it — a long
        // clause whose heading has scrolled past and whose end has not yet
        // arrived — the last answer stands, which is the right one.
        const current = sections.find((section) => inBand.current.has(section.id))
        if (current) setActive(current.id)
      },
      {
        // A thin strip just below the fixed header. -96px matches the
        // scroll-mt-24 the clauses use, so the clause a link scrolls you to is
        // the clause that lights up.
        rootMargin: '-96px 0px -70% 0px',
        threshold: 0,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // Keyed on the joined ids, not on `sections` itself. Setting the active
    // clause re-renders this component, and depending on the array would then
    // tear down and rebuild the observer on every scroll — which would drop
    // the intersection state it had just accumulated. `key` changes only when
    // the clauses actually change, which is what the effect cares about.
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav
      aria-label="Contents"
      className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Contents
      </h2>
      <ol className="mt-4 space-y-2 lg:mt-5 lg:space-y-2.5 lg:border-l lg:border-border lg:pl-5">
        {sections.map((section, index) => {
          const isActive = section.id === active
          return (
            <li key={section.id} className="relative flex gap-3 text-sm">
              {/* Sits exactly on the rule the list is indented from, so the
                  marker reads as part of it rather than as a loose dash. */}
              <span
                aria-hidden="true"
                className={`absolute -left-5 top-1 hidden w-px bg-primary transition-all duration-200 lg:block motion-reduce:transition-none ${
                  isActive ? 'h-5 opacity-100' : 'h-0 opacity-0'
                }`}
              />
              <span
                aria-hidden="true"
                className={`w-5 shrink-0 tabular-nums transition-colors motion-reduce:transition-none ${
                  isActive ? 'text-primary' : 'text-muted-foreground/60'
                }`}
              >
                {index + 1}.
              </span>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-sm text-balance underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none ${
                  isActive ? 'font-medium text-primary' : 'text-muted-foreground'
                }`}
              >
                {section.heading}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
