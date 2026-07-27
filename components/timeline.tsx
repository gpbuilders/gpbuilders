export function Timeline() {
  const milestones = [
    {
      year: '2021',
      title: 'Founded',
      description: 'GP Builders established with a vision for quality construction and affordable luxury.',
    },
    {
      year: '2022',
      title: 'First Landmark',
      description: 'Completed our first residential project, setting the standard for excellence.',
    },
    {
      year: '2023',
      title: 'Commercial Expansion',
      description: 'Expanded into commercial spaces and hospitality design projects.',
    },
    {
      year: '2024',
      title: 'Industry Recognition',
      description: 'Recognized for innovative design and sustainable construction practices.',
    },
  ]

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Journey
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">
            Milestones
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.year} className="relative">
              {/* Vertical line */}
              {index < milestones.length - 1 && (
                <div className="absolute top-12 left-6 h-[calc(100%+2rem)] w-0.5 bg-gradient-to-b from-primary to-transparent md:hidden" />
              )}

              {/* Timeline dot and year */}
              <div className="flex flex-col items-start md:items-center md:text-center">
                <div className="relative mb-6 flex items-center">
                  <div className="h-14 w-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="hidden md:block absolute left-full top-1/2 h-1 w-full bg-gradient-to-r from-primary to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="md:px-2">
                  <p className="font-serif text-2xl font-semibold text-primary">
                    {milestone.year}
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
