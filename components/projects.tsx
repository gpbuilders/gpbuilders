'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mediaUrl } from '@/lib/media'
import type { Project } from '@/payload-types'
import { ProjectDetailModal } from './project-detail-modal'

type Category = Project['category']

const FILTERS: { label: string; value: Category }[] = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
]

export function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Category>('residential')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const filtered = projects.filter((p) => p.category === active)

  return (
    <section id="projects" className="scroll-mt-20 py-20 lg:py-28">
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

        {filtered.length === 0 ? (
          <p className="mt-12 text-muted-foreground">
            No {active} projects to show yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <article
                key={project.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card cursor-pointer transition-all hover:shadow-xl hover:border-primary/50',
                  project.featured && 'md:col-span-2 lg:row-span-2',
                )}
                onClick={() => setSelectedProject(project)}
              >
                <div
                  className={cn(
                    'relative flex-1 overflow-hidden',
                    project.featured ? 'min-h-72 lg:min-h-[520px]' : 'min-h-60',
                  )}
                >
                  <Image
                    src={mediaUrl(project.image)}
                    alt={`${project.title} — ${project.scope} by GP Builders`}
                    width={900}
                    height={650}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        )}
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
