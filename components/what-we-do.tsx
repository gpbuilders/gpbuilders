import { Compass, Palette, HardHat } from 'lucide-react'

export function WhatWeDo() {
  const services = [
    {
      icon: Compass,
      title: 'Architecture & Design',
      description:
        'Visionary designs that blend aesthetics with functionality, tailored to your space and lifestyle.',
    },
    {
      icon: HardHat,
      title: 'Construction',
      description:
        'Precise on-site delivery and finishing, backed by transparent timelines and rigorous quality oversight.',
    },
    {
      icon: Palette,
      title: 'Interior Design',
      description:
        'Curated interiors using premium materials and expert craftsmanship to transform spaces.',
    },
  ]

  return (
    <section className="bg-background-alt py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Services
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">
            What We Do
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            We deliver complete construction, design, and interior solutions
            under one roof.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
