const MILESTONES = [
  {
    year: '2021',
    title: 'The Beginning',
    points: [
      'Company founded with the vision of quality construction at an affordable price.',
      'Successfully completed our first residential and interior projects.',
    ],
  },
  {
    year: '2022–2023',
    title: 'Building Trust',
    points: [
      'Expanded our portfolio across residential construction and interior design.',
      'Earned repeat business and referrals through consistent quality.',
    ],
  },
  {
    year: '2024–2025',
    title: 'Steady Growth',
    points: [
      '9+ full construction projects completed.',
      '20+ interior projects delivered, from modular kitchens to complete homes.',
      'Built a reputation for transparent pricing and reliable execution.',
    ],
  },
  {
    year: 'Today',
    title: 'Growing with Confidence',
    points: [
      '100% commitment to quality and affordability.',
      'Continuing to build homes, commercial spaces, and interiors with passion.',
    ],
  },
]

export function Milestones() {
  return (
    <section className="scroll-mt-20 bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
            Our Journey
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Milestones &amp; achievements
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/80">
            Since 2021, every project has been a stepping stone toward building
            a trusted name in construction and interiors.
          </p>
        </div>

        <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((milestone, index) => (
            <li
              key={milestone.year}
              className="relative rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6"
            >
              <span className="font-serif text-sm font-semibold text-primary-foreground/60">
                0{index + 1}
              </span>
              <p className="mt-2 font-serif text-2xl font-semibold">
                {milestone.year}
              </p>
              <p className="mt-1 text-sm font-medium text-primary-foreground/90">
                {milestone.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {milestone.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-primary-foreground/75"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground/50" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
