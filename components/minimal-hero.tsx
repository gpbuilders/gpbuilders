'use client'

import { cn } from '@/lib/utils'

export function MinimalHero({
  title,
  subtitle,
  description,
  background = 'default',
}: {
  title: string
  subtitle: string
  description: string
  /** Which page ground the hero sits on. Shared with the contact page, so
      this is opt-in rather than a change to both. */
  background?: 'default' | 'alt'
}) {
  // The site header is fixed and ~64px tall, so it sits over the top of this
  // section. Top padding has to clear that before it starts creating any
  // actual breathing room — hence pt being much larger than pb.
  return (
    <section
      className={cn(
        'w-full pb-16 pt-28 lg:pb-24 lg:pt-40',
        background === 'alt' ? 'bg-background-alt' : 'bg-background',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
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
