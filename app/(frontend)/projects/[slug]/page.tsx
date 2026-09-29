import { cache } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
import config from '@payload-config'
import { getPayload } from 'payload'

import { ProjectGallery } from '@/components/project-gallery'
import { CtaBand } from '@/components/cta-band'
import { mediaAlt, mediaUrl, type MediaField } from '@/lib/media'
import type { Project } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

const CATEGORY_LABELS: Record<Project['category'], string> = {
  residential: 'Residential',
  commercial: 'Commercial',
}

/**
 * Wrapped in React's `cache` so generateMetadata and the page itself share one
 * result. Next runs the two together for the same request, so without this the
 * page opens with two identical queries to Sydney — about 300ms of the render
 * spent fetching a row already in memory. Free when the page was prerendered;
 * paid by every visitor now that it is not.
 */
const findProject = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  // depth 1 populates image and every gallery entry, which is what lets the
  // page lay each photograph out at its own proportions.
  //
  // overrideAccess defaults to TRUE on the Local API. Turning it off applies
  // the collection's own read rule, the same as the article route does.
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
    overrideAccess: false,
  })

  return docs[0]
})

/**
 * Builds every project's page at deploy time, so the first visitor to one is
 * not the person who pays for rendering it. A project added afterwards is not
 * in this list and is rendered on its first request instead, then cached like
 * the rest — nothing needs rebuilding for a new project to work.
 */
export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 500,
    select: { slug: true },
  })

  return docs.flatMap((project) => (project.slug ? [{ slug: project.slug }] : []))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = await findProject(slug)

  if (!project) {
    return { title: 'Project not found | GP Builders' }
  }

  // Most projects have no description written yet, so the fallback has to read
  // as a real sentence rather than an empty string.
  const description =
    project.description ??
    `${project.scope} in ${project.location} by GP Builders.`
  const image = mediaUrl(project.image, '')

  return {
    title: `${project.title} | GP Builders`,
    description,
    openGraph: {
      type: 'article',
      title: project.title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

/** Natural proportions, so a portrait photograph is not forced into a band. */
function ratio(media: MediaField, fallback = 3 / 2): number {
  if (media && typeof media === 'object' && media.width && media.height) {
    return media.width / media.height
  }
  return fallback
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = await findProject(slug)

  if (!project) {
    notFound()
  }

  const gallery = (project.gallery ?? []) as MediaField[]

  const payload = await getPayload({ config })
  // Two more from the same category. Derived rather than curated, so there
  // is no field for an editor to keep in step.
  const { docs: related } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 2,
    sort: 'order',
    where: {
      category: { equals: project.category },
      id: { not_equals: project.id },
    },
    overrideAccess: false,
  })

  return (
    <>
      <article className="w-full bg-background pb-12 lg:pb-20">
        <header className="relative isolate flex min-h-[620px] flex-col justify-between overflow-hidden bg-dark-bg pt-24 text-background sm:min-h-[760px] lg:min-h-[min(900px,100svh)] lg:pt-28">
          <Image
            src={mediaUrl(project.image)}
            alt={mediaAlt(project.image, project.title)}
            fill
            sizes="100vw"
            className="-z-20 object-cover"
            priority
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-dark-bg/90 via-dark-bg/45 to-dark-bg/25" />
          <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8">
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-background/90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background">
              <ArrowLeft size={16} aria-hidden="true" /> All projects
            </Link>
          </div>
          <div className="mx-auto grid w-full max-w-site gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-16 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20 lg:px-8 lg:pb-20">
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-background/85">
                <span>{project.location}</span>
                <span>{CATEGORY_LABELS[project.category]}</span>
                {project.ongoing ? <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Ongoing</span> : null}
              </div>
              <h1 className="mt-5 text-balance font-serif text-[clamp(2.75rem,6vw,6.5rem)] font-medium leading-[1.02] tracking-tight">
                {project.title}
              </h1>
            </div>
            <div className="max-w-lg lg:pb-1">
              <p className="text-pretty text-base leading-relaxed text-background/90 sm:text-lg lg:text-xl">
                {project.description || `${project.scope} in ${project.location}, by GP Builders.`}
              </p>
              <a href="#project-gallery" className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-background/50 text-sm hover:border-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background">
                Explore the project <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </header>

        <div id="project-gallery" className="mx-auto max-w-site scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <dl className="grid gap-6 border-b border-border py-8 text-sm sm:grid-cols-3 lg:py-10">
            <div><dt className="text-xs uppercase tracking-[0.16em] text-primary">Scope</dt><dd className="mt-2 text-foreground">{project.scope}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-primary">Location</dt><dd className="mt-2 text-foreground">{project.location}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-primary">Project gallery</dt><dd className="mt-2 text-foreground">{gallery.length + 1} photographs</dd></div>
          </dl>
        </div>

        {gallery.length > 0 && (
          <ProjectGallery title={project.title} images={gallery.map((image, index) => ({
            src: mediaUrl(image),
            alt: mediaAlt(image, `${project.title} — photograph ${index + 1}`),
            ratio: ratio(image),
          }))} />
        )}
      </article>

      {related.length > 0 ? (
        <section className="w-full bg-background-alt py-16 lg:py-24">
          <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Continue exploring</p>
                <h2 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl">More spaces, thoughtfully built.</h2>
              </div>
              <Link href="/projects" className="inline-flex min-h-11 items-center gap-3 self-start border-b border-primary text-sm text-primary sm:self-auto">View all projects <ArrowUpRight size={16} /></Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="group relative block overflow-hidden bg-card transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={mediaUrl(item.image)}
                      alt={mediaAlt(item.image, item.title)}
                      width={900}
                      height={650}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-serif text-xl font-semibold text-background">
                        {item.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-background/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  )
}
