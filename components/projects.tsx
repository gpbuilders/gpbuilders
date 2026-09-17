'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mediaUrl } from '@/lib/media'
import type { Project } from '@/payload-types'
import { ProjectDetailModal } from './project-detail-modal'

// 'all' is not a category on the collection — it is the absence of a filter,
// and it is the default. Opening on 'residential' meant a visitor who did not
// notice the control never saw the commercial work at all.
type Filter = Project['category'] | 'all'

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
]

// The grid is three columns at lg, and a featured project takes a 2x2 block of
// it. Left to CSS auto-placement every one of those blocks lands on the left,
// so a page with several featured projects reads as a single column of big
// tiles. This walks the list and places each card explicitly instead, flipping
// the big tile to the right-hand columns every second time.
//
// Only the lg layout is computed here — below that the grid is one or two
// columns and a featured card simply spans the full width.
const LG_COLS = 3

type Cell = { colStart: number; rowStart: number; colSpan: number; rowSpan: number }

function layoutProjects(projects: Project[]): Cell[] {
  const taken = new Set<string>()
  const key = (row: number, col: number) => `${row}:${col}`

  const isFree = (row: number, col: number, colSpan: number, rowSpan: number) => {
    if (col + colSpan - 1 > LG_COLS) return false
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) {
        if (taken.has(key(row + r, col + c))) return false
      }
    }
    return true
  }

  const occupy = (row: number, col: number, colSpan: number, rowSpan: number) => {
    for (let r = 0; r < rowSpan; r++) {
      for (let c = 0; c < colSpan; c++) taken.add(key(row + r, col + c))
    }
  }

  // Never moves backwards, so a small card fills the space beside the big tile
  // it follows rather than backfilling a gap further up the page.
  let cursorRow = 1
  let featuredSeen = 0

  return projects.map((project) => {
    if (project.featured) {
      const colStart = featuredSeen % 2 === 0 ? 1 : LG_COLS - 1
      featuredSeen++

      let rowStart = cursorRow
      while (!isFree(rowStart, colStart, 2, 2)) rowStart++

      occupy(rowStart, colStart, 2, 2)
      cursorRow = rowStart
      return { colStart, rowStart, colSpan: 2, rowSpan: 2 }
    }

    let rowStart = cursorRow
    let colStart = 1
    while (!isFree(rowStart, colStart, 1, 1)) {
      colStart++
      if (colStart > LG_COLS) {
        colStart = 1
        rowStart++
      }
    }

    occupy(rowStart, colStart, 1, 1)
    cursorRow = rowStart
    return { colStart, rowStart, colSpan: 1, rowSpan: 1 }
  })
}

export function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Shown on each segment so the visitor knows what is behind it before
  // clicking, and so an empty category is obvious rather than a dead end.
  const counts = useMemo<Record<string, number>>(() => {
    const byCategory = projects.reduce<Record<string, number>>((acc, project) => {
      acc[project.category] = (acc[project.category] ?? 0) + 1
      return acc
    }, {})

    return { ...byCategory, all: projects.length }
  }, [projects])

  const filtered = useMemo(
    () =>
      active === 'all' ? projects : projects.filter((p) => p.category === active),
    [projects, active],
  )

  // Recomputed per filter: with only the commercial projects showing, the one
  // featured among them is the first again and belongs back on the left.
  const cells = useMemo(() => layoutProjects(filtered), [filtered])

  const activeLabel = FILTERS.find((f) => f.value === active)?.label ?? ''

  return (
    <section id="projects" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Selected Work
          </p>
          <h2 className="mt-3 text-balance font-serif text-5xl font-semibold leading-tight text-foreground">
            Projects we&apos;re proud of
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div
            // group, not tablist: these filter a grid that is already on the
            // page rather than swapping between panels, so the tab role would
            // promise keyboard behaviour (arrow keys, roving focus) this does
            // not implement.
            role="group"
            aria-label="Filter projects by category"
            className="inline-flex gap-0.5 rounded-full border border-border bg-card p-1"
          >
            {FILTERS.map((filter) => {
              const isActive = active === filter.value
              const count = counts[filter.value] ?? 0

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActive(filter.value)}
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors sm:px-5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      'min-w-5 rounded-full px-1.5 py-0.5 text-center font-mono text-[10px] font-medium tracking-normal',
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-background-alt text-muted-foreground',
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* The grid changes with no visible feedback for a screen reader, so
            say what happened. Polite: it should not interrupt. */}
        <p aria-live="polite" className="sr-only">
          Showing {filtered.length}{' '}
          {filtered.length === 1 ? 'project' : 'projects'} in {activeLabel}.
        </p>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            No {activeLabel.toLowerCase()} to show yet.
          </p>
        ) : (
          <div className="project-grid mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <article
                key={project.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card cursor-pointer transition-all hover:shadow-xl hover:border-primary/50',
                  project.featured && 'md:col-span-2',
                )}
                // Read by .project-grid in globals.css, which only applies them
                // at lg. Inline because the row numbers are unbounded, and
                // Tailwind cannot generate a class it never sees in the source.
                style={
                  {
                    '--pc': cells[index].colStart,
                    '--pr': cells[index].rowStart,
                    '--pcs': cells[index].colSpan,
                    '--prs': cells[index].rowSpan,
                  } as React.CSSProperties
                }
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
