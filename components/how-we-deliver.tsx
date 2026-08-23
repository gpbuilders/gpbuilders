const STEPS = [
  {
    num: '01',
    title: 'Project planning',
    description:
      'Requirements, scope, macro schedule and milestones — defined before work begins.',
  },
  {
    num: '02',
    title: 'Weekly progress reviews',
    description:
      'Management and site engineers review progress, resolve snags, and plan the week ahead.',
  },
  {
    num: '03',
    title: 'Leadership inspections',
    description:
      'The MD visits every active site twice weekly to inspect quality and unblock delivery.',
  },
  {
    num: '04',
    title: 'Engineering-led sites',
    description:
      'Experienced engineers handle supervision, coordination, documentation and safety.',
  },
  {
    num: '05',
    title: 'Continuous quality checks',
    description:
      'Quality monitoring built into every stage of construction and interior work.',
  },
  {
    num: '06',
    title: 'On-time delivery',
    description:
      'Disciplined planning and proactive reviews keep every project on schedule.',
  },
]

export function HowWeDeliver() {
  return (
    <section className="bg-background-alt py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3.5 text-xs uppercase tracking-[0.28em] text-primary">
          How we deliver
        </p>
        <h2 className="mb-14 font-serif text-3xl font-normal text-foreground sm:text-4xl lg:text-[40px]">
          Plan strategically. Execute precisely.
        </h2>

        <div className="grid gap-x-14 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num} className="flex items-start gap-5">
              <span className="min-w-11 font-serif text-[34px] leading-none text-secondary/45">
                {step.num}
              </span>
              <div>
                <h3 className="mb-2 text-[17px] font-medium tracking-[0.02em] text-foreground">
                  {step.title}
                </h3>
                <p className="text-[14.5px] font-light leading-[1.6] text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 font-serif text-xl tracking-[0.04em] text-primary">
          Our Managing Director personally inspects every active site — twice a
          week.
        </p>
      </div>
    </section>
  )
}
