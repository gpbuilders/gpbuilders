import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'GP Builders turned our plot into a home beyond what we imagined. The attention to detail and honest pricing made the whole journey stress-free.',
    name: 'Ramesh & Latha',
    role: 'Residential Villa Owners',
    initials: 'RL',
  },
  {
    quote:
      'From architecture to interiors, everything was handled under one roof. Weekly reviews kept us informed and the project finished right on schedule.',
    name: 'Karthik Subramanian',
    role: 'Apartment Interior Client',
    initials: 'KS',
  },
  {
    quote:
      'They delivered a premium restaurant fit-out within our budget. Craftsmanship and communication were exceptional from day one.',
    name: 'Anjali Menon',
    role: 'Commercial Client',
    initials: 'AM',
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Customer Feedback
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Trusted by families &amp; businesses
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-8"
            >
              <Quote className="h-8 w-8 text-primary/25" />
              <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-base leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-semibold text-primary">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {t.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
