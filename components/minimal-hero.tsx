'use client'

export function MinimalHero({
  eyebrow,
  title,
  subtitle,
  description,
}: {
  eyebrow: string
  title: string
  subtitle: string
  description: string
}) {
  return (
    <section className="w-full bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            {/* Eyebrow with icon */}
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {eyebrow}
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="font-serif text-6xl lg:text-7xl font-semibold text-foreground leading-tight">
                {title}
              </h1>
              <p className="font-serif text-5xl lg:text-6xl font-light text-muted-foreground leading-tight mt-2">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Column - Description */}
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
