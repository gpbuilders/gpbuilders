import Link from 'next/link'
import { Compass, PencilRuler, HardHat, Check, ArrowRight } from 'lucide-react'

const SERVICES = [
  {
    icon: Compass,
    title: 'Architecture + Interior + Construction',
    description:
      'Full end-to-end delivery — from architectural design and space planning to interiors and on-site execution, managed under one roof.',
    features: [
      'In-house architecture team',
      'Concept to completion',
      'Single point of accountability',
    ],
    featured: true,
  },
  {
    icon: PencilRuler,
    title: 'Interior Design + Construction',
    description:
      'Elevate your existing space with bespoke interior design and precise execution — modular kitchens, living spaces, and complete home interiors.',
    features: [
      'Tailored interior concepts',
      'Premium material selection',
      'Turnkey installation',
    ],
    featured: false,
  },
  {
    icon: HardHat,
    title: 'Construction Only',
    description:
      'Already have designs and drawings? Our engineering and site teams deliver disciplined, quality-driven execution on schedule.',
    features: [
      'Skilled site management',
      'Quality and safety compliance',
      'On-time delivery',
    ],
    featured: false,
  },
]

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            What We Do
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Three ways to work with us
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Whether you need the full journey or a single stage, we adapt to
            where your project stands today.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className={[
                  'group relative flex flex-col rounded-2xl border p-8 transition-shadow hover:shadow-lg',
                  service.featured
                    ? 'border-primary bg-card shadow-md ring-1 ring-primary/20'
                    : 'border-border bg-card',
                ].join(' ')}
              >
                {service.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                >
                  Enquire now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
