'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PageHero({
  eyebrow,
  title,
  description,
  currentLabel,
}: {
  eyebrow: string
  title: string
  description: string
  currentLabel: string
}) {
  return (
    <section className="relative w-full min-h-[500px] overflow-hidden bg-background">
      {/* Geometric background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/8 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl translate-y-1/2" />
      
      {/* Subtle accent lines */}
      <div className="absolute top-20 right-12 w-1 h-48 bg-gradient-to-b from-accent to-transparent" />
      <div className="absolute bottom-32 left-8 w-0.5 h-40 bg-gradient-to-b from-primary to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 text-sm mb-16"
        >
          <Link href="/" className="text-muted-foreground transition-colors hover:text-primary font-medium">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-border" />
          <span className="font-semibold text-primary">{currentLabel}</span>
        </nav>

        <div className="max-w-5xl">
          {/* Eyebrow with decorative accent line */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-0.5 w-10 bg-accent" />
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          </div>

          {/* Main title - bold and distinctive */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] text-foreground mb-8 tracking-tight">
            {title}
          </h1>

          {/* Decorative gradient line under title */}
          <div className="h-1.5 w-24 bg-gradient-to-r from-accent to-primary mb-10" />

          {/* Description with refined styling */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            {description}
          </p>
        </div>

        {/* Floating accent square - geometric element */}
        <div className="absolute bottom-24 right-8 sm:right-16 w-20 h-20 sm:w-32 sm:h-32 border-2 border-accent/20 rounded-3xl opacity-50 hover:opacity-80 transition-opacity duration-500" />
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent/0" />
    </section>
  )
}
