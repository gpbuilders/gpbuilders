/**
 * What a visitor sees while this section is being fetched.
 *
 * There was no loading boundary anywhere on the site, and that is most of why
 * moving around it felt broken rather than merely slow. Every page is rendered
 * per request, so a link click is a server round trip — and with no boundary
 * for React to show, the browser keeps painting the page you are leaving.
 * Nothing moves, nothing spins, the link you clicked does not even look
 * clicked. Measured before this went in, a project page took 1.7-1.9s to
 * answer, and for all of it the site looked frozen.
 *
 * The second reason is prefetching. For a dynamic route Next prefetches the
 * shell down to the nearest loading boundary; with none to find, a hovered
 * link prefetches nothing and every click starts from cold. This file is what
 * gives it something to fetch ahead.
 *
 * Deliberately a skeleton of the real layout rather than a spinner, at the
 * same heights the section actually uses, so the page does not jump when the
 * content lands. `animate-pulse` is a Tailwind default and already stops
 * under prefers-reduced-motion, which the site's globals.css also honours.
 */
export default function Loading() {
  return (
    <>
      {/* Matches PageHero: full width, dark, 600px from lg up. */}
      <section className="relative w-full overflow-hidden bg-dark-bg lg:min-h-[600px]">
        <div className="mx-auto max-w-site px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <div className="h-4 w-28 animate-pulse rounded bg-white/15" />
          <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-white/15 lg:h-16" />
          <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-2/3 max-w-lg animate-pulse rounded bg-white/10" />
        </div>
      </section>

      <div className="bg-background">
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i}>
                  <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-muted/40" />
                  <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-muted/40" />
                  <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted/30" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
