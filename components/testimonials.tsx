import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
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
  {
    quote:
      'I had a great experience with this construction company. The quality of work is excellent, and the team is professional, reliable, and committed to delivering on time. The engineer is very respectful, approachable, and treats everyone with kindness. Their friendly attitude and willingness to listen make the entire experience smooth and stress-free. I highly recommend this company to anyone looking for trustworthy and high-quality construction services.',
    name: 'Harihara Sudhan',
    role: 'Construction Client',
    initials: 'HS',
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Customer Feedback
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-muted sm:text-5xl">
            Trusted by families &amp; businesses
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border-t border-muted/20 pt-7"
            >
              <Quote className="h-8 w-8 text-accent/30" />
              <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-base leading-relaxed text-muted/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-muted/10 pt-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-serif text-sm font-semibold text-accent">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-muted">
                    {t.name}
                  </span>
                  <span className="block text-xs text-muted/60">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
