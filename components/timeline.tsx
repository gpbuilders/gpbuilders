const MILESTONES = [
  {
    year: '2021',
    title: 'The beginning',
    description:
      'Founded with the vision of quality construction at an affordable price. First residential and interior projects completed.',
  },
  {
    year: '2022–23',
    title: 'Building trust',
    description:
      'Portfolio expanded across residential construction and interiors, with repeat business and referrals from consistent quality.',
  },
  {
    year: '2024–25',
    title: 'Steady growth',
    description:
      '9+ full construction projects and 20+ interiors delivered — from modular kitchens to complete home transformations.',
  },
  {
    year: 'Today',
    title: 'Growing with confidence',
    description:
      'Continuing to build homes, commercial spaces, and interiors with the same passion and integrity that inspired the journey.',
  },
]

export function Timeline() {
  return (
    <section className="bg-background-alt py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3.5 text-xs uppercase tracking-[0.28em] text-secondary">
          Milestones
        </p>
        <h2 className="mb-16 font-serif text-3xl font-normal text-foreground sm:text-4xl lg:text-[38px]">
          The journey so far
        </h2>

        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {MILESTONES.map((milestone) => (
            <div
              key={milestone.year}
              className="relative border-l border-primary/35 px-7 pb-2"
            >
              <span className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-primary" />
              <div className="mb-1.5 font-serif text-[26px] text-primary">
                {milestone.year}
              </div>
              <div className="mb-3 text-[13px] uppercase tracking-[0.14em] text-foreground">
                {milestone.title}
              </div>
              <p className="text-sm font-light leading-[1.65] text-muted-foreground">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
