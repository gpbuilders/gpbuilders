import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

type Project = {
  title: string
  scope: string
  location: string
  image: string
}

const HERO: Project = {
  title: 'Courtyard Residence',
  scope: 'Architecture + Interior + Construction',
  location: 'Chennai',
  image: '/interior-hallway.jpg',
}

const SUPPORTING: Project[] = [
  {
    title: 'Contemporary Villa',
    scope: 'Architecture + Construction',
    location: 'Coimbatore',
    image: '/exterior-render.jpg',
  },
  {
    title: 'Warm Minimal Living',
    scope: 'Interior Design + Construction',
    location: 'Bengaluru',
    image: '/project-living-room.png',
  },
  {
    title: 'Heritage Dining House',
    scope: 'Interior Design + Construction',
    location: 'Chennai',
    image: '/commercial-restaurant.jpg',
  },
]

function ProjectCard({
  project,
  ratio,
  sizes,
}: {
  project: Project
  ratio: string
  sizes: string
}) {
  return (
    <Link
      href="/projects"
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
    >
      <div className={cn('relative w-full overflow-hidden', ratio)}>
        <Image
          src={project.image}
          alt={`${project.title} — ${project.scope} by GP Builders`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
    </Link>
  )
}

export function SelectedWork() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-10">
          <h2 className="font-serif text-3xl font-normal text-foreground sm:text-4xl lg:text-[40px]">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="border-b border-foreground/30 pb-[3px] text-[13px] uppercase tracking-[0.14em] text-foreground transition-colors hover:text-secondary"
          >
            All projects →
          </Link>
        </div>

        <div className="space-y-6">
          <ProjectCard
            project={HERO}
            ratio="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
            sizes="100vw"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {SUPPORTING.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                ratio="aspect-[4/3]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
