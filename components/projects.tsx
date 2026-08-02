'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectDetailModal } from './project-detail-modal'

type Category = 'residential' | 'commercial'

const PROJECTS: {
  title: string
  location: string
  scope: string
  category: Category
  image: string
  description?: string
  gallery?: string[]
  large?: boolean
}[] = [
  {
    title: 'Courtyard Residence',
    location: 'Chennai',
    scope: 'Architecture + Interior + Execution',
    category: 'residential',
    image: '/interior-hallway.jpg',
    description: 'A thoughtfully designed residential sanctuary featuring an open courtyard with lush landscaping. The project seamlessly blends modern architecture with natural elements, creating warm living spaces that encourage family connection. Premium materials and sustainable design practices ensure both beauty and longevity.',
    gallery: ['/interior-hallway.jpg', '/project-living-room.png', '/project-landscape.png'],
    large: true,
  },
  {
    title: 'Contemporary Villa',
    location: 'Coimbatore',
    scope: 'Architecture + Execution',
    category: 'residential',
    image: '/exterior-render.jpg',
    description: 'A contemporary villa showcasing minimalist design principles with maximum impact. Clean lines, expansive windows, and carefully curated spaces create a luxurious yet livable home. Every detail from structure to execution reflects our commitment to quality.',
    gallery: ['/exterior-render.jpg'],
  },
  {
    title: 'Warm Minimal Living',
    location: 'Bengaluru',
    scope: 'Interior Design + Execution',
    category: 'residential',
    image: '/project-living-room.png',
    description: 'An interior design project that proves minimalism doesn\'t mean cold. Warm tones, natural wood, and strategic teal accents create a sophisticated living space that feels both curated and inviting.',
    gallery: ['/project-living-room.png'],
  },
  {
    title: 'Modular Kitchen Suite',
    location: 'Chennai',
    scope: 'Interior Design + Execution',
    category: 'residential',
    image: '/project-kitchen.png',
    description: 'A state-of-the-art modular kitchen combining functionality with premium aesthetics. Custom cabinetry, quality appliances, and thoughtful workflow design make this kitchen both beautiful and practical for everyday living.',
    gallery: ['/project-kitchen.png'],
  },
  {
    title: 'Landscaped Courtyard',
    location: 'Madurai',
    scope: 'Landscape + Execution',
    category: 'residential',
    image: '/project-landscape.png',
    description: 'A beautifully landscaped outdoor space that extends the home\'s living areas. Native plants, water features, and comfortable seating areas create a serene retreat within the property.',
    gallery: ['/project-landscape.png'],
  },
  {
    title: 'Heritage Dining House',
    location: 'Chennai',
    scope: 'Interior Design + Execution',
    category: 'commercial',
    image: '/commercial-restaurant.jpg',
    description: 'A premium dining establishment blending heritage aesthetics with contemporary comfort. Curated lighting, refined materials, and thoughtful space planning create an unforgettable dining experience.',
    gallery: ['/commercial-restaurant.jpg'],
    large: true,
  },
  {
    title: 'Corporate Reception',
    location: 'Bengaluru',
    scope: 'Interior Design + Execution',
    category: 'commercial',
    image: '/project-commercial.png',
    description: 'An impressive corporate reception space that reflects brand identity and professionalism. Modern design, optimal acoustics, and functional elegance welcome clients and employees alike.',
    gallery: ['/project-commercial.png'],
  },
]

const FILTERS: { label: string; value: Category }[] = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
]

export function Projects() {
  const [active, setActive] = useState<Category>('residential')
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null)
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
                'group relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer transition-all hover:shadow-xl hover:border-primary/50',
                project.large && 'md:col-span-2 lg:row-span-2',
              )}
              onClick={() => setSelectedProject(project)}
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

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
