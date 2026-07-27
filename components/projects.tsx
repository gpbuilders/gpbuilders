'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

type Category = 'residential' | 'commercial'

const PROJECTS: {
  title: string
  location: string
  scope: string
  category: Category
  image: string
  large?: boolean
}[] = [
  {
    title: 'Courtyard Residence',
    location: 'Chennai',
    scope: 'Architecture + Interior + Execution',
    category: 'residential',
    image: '/interior-hallway.jpg',
    large: true,
  },
  {
    title: 'Contemporary Villa',
    location: 'Coimbatore',
    scope: 'Architecture + Execution',
    category: 'residential',
    image: '/exterior-render.jpg',
  },
  {
    title: 'Warm Minimal Living',
    location: 'Bengaluru',
    scope: 'Interior Design + Execution',
    category: 'residential',
    image: '/project-living-room.png',
  },
  {
    title: 'Modular Kitchen Suite',
    location: 'Chennai',
    scope: 'Interior Design + Execution',
    category: 'residential',
    image: '/project-kitchen.png',
  },
  {
    title: 'Landscaped Courtyard',
    location: 'Madurai',
    scope: 'Landscape + Execution',
    category: 'residential',
    image: '/project-landscape.png',
  },
  {
    title: 'Heritage Dining House',
    location: 'Chennai',
    scope: 'Interior Design + Execution',
    category: 'commercial',
    image: '/commercial-restaurant.jpg',
    large: true,
  },
  {
    title: 'Corporate Reception',
    location: 'Bengaluru',
    scope: 'Interior Design + Execution',
    category: 'commercial',
    image: '/project-commercial.png',
  },
]

const FILTERS: { label: string; value: Category }[] = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
]

export function Projects() {
  const [active, setActive] = useState<Category>('residential')
  const filtered = PROJECTS.filter((p) => p.category === active)

  return (
    <section id="projects" className="scroll-mt-20 bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Selected Work
            </p>
            <h2 className="mt-3 text-balance font-serif text-5xl font-semibold leading-tight text-foreground">
              Projects we&apos;re proud of
            </h2>
          </div>

          <div className="flex gap-4">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActive(filter.value)}
                className={cn(
                  'pb-3 text-sm font-semibold uppercase tracking-widest transition-all border-b-2',
                  active === filter.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground/60 hover:text-primary',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <article
              key={project.title}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-border bg-card',
                project.large && 'md:col-span-2 lg:row-span-2',
              )}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image || '/placeholder.svg'}
                  alt={`${project.title} — ${project.scope} by GP Builders`}
                  width={900}
                  height={650}
                  className={cn(
                    'w-full object-cover transition-transform duration-500 group-hover:scale-105',
                    project.large ? 'h-72 lg:h-[520px]' : 'h-60',
                  )}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary">
                    {project.scope}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-semibold text-background">
                    {project.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-background/80">
                    <MapPin className="h-3.5 w-3.5" />
                    {project.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
