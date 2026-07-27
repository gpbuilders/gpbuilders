import {
  Gem,
  HandCoins,
  Users,
  ShieldCheck,
  Clock,
  Lightbulb,
  HardHat,
  Handshake,
} from 'lucide-react'

const VALUES = [
  {
    icon: Gem,
    title: 'Quality First',
    description:
      'Every material, process, and detail reflects our uncompromising commitment to excellence.',
  },
  {
    icon: HandCoins,
    title: 'Affordability with Integrity',
    description:
      'Transparent, competitive pricing designed for maximum value — never at the cost of quality.',
  },
  {
    icon: Users,
    title: 'Customer-Centric',
    description:
      'We listen, communicate openly, and collaborate to deliver spaces that reflect your vision.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparency & Trust',
    description:
      'Honest, ethical practices with clear communication from planning to completion.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description:
      'Efficient planning and disciplined execution to complete projects on schedule.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Modern techniques and evolving technologies for functional, sustainable spaces.',
  },
  {
    icon: HardHat,
    title: 'Safety & Responsibility',
    description:
      'The highest safety standards, respecting our workforce, clients, and environment.',
  },
  {
    icon: Handshake,
    title: 'Long-Term Relationships',
    description:
      'Beyond projects, we build lasting relationships based on reliability and trust.',
  },
]

export function Values() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Mission &amp; Values
            </p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              The principles behind every project
            </h2>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
              Our mission is to deliver exceptional construction and interior
              solutions that combine quality, durability, and affordability —
              transforming our clients&apos; visions into reality through
              innovative design and superior craftsmanship.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((value) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
