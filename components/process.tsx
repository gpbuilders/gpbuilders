import {
  ClipboardList,
  CalendarCheck,
  UserCheck,
  Building2,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react'

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Project Planning',
    description:
      'We define scope, prepare the macro schedule, and establish key milestones for timely execution.',
  },
  {
    icon: CalendarCheck,
    title: 'Weekly Progress Review',
    description:
      'Structured reviews evaluate progress, resolve snags, check quality, and plan the week ahead.',
  },
  {
    icon: UserCheck,
    title: 'Leadership Site Inspections',
    description:
      'Our Managing Director visits every active project twice a week to inspect quality and progress.',
  },
  {
    icon: Building2,
    title: 'Engineering & Site Management',
    description:
      'Experienced teams handle supervision, documentation, coordination, and progress tracking.',
  },
  {
    icon: ShieldCheck,
    title: 'Continuous Quality Monitoring',
    description:
      'Quality checks at every stage ensure precision, durability, and specification compliance.',
  },
  {
    icon: PackageCheck,
    title: 'Timely Project Delivery',
    description:
      'Disciplined planning and efficient coordination deliver every project on time.',
  },
]

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Programme Strategy
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            How we execute, every time
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Plan strategically. Execute precisely. Review consistently. Deliver
            excellence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border bg-card p-8"
              >
                <span className="absolute right-6 top-6 font-serif text-4xl font-semibold text-primary/10">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
