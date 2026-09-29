import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import config from '@payload-config'
import { getPayload } from 'payload'

import { CtaBand } from '@/components/cta-band'
import { mediaAlt, mediaUrl, type MediaField } from '@/lib/media'
import type { Project } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

const CATEGORY_LABELS: Record<Project['category'], string> = {
  residential: 'Residential',
  commercial: 'Commercial',
}

async function findProject(slug: string) {
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
}

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
  // Three more from the same category. Derived rather than curated, so there
  // is no field for an editor to keep in step.
  const { docs: related } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 3,
    sort: 'order',
    where: {
      category: { equals: project.category },
      id: { not_equals: project.id },
    },
    overrideAccess: false,
  })

  return (
    <>
      {/* The site header is fixed and ~64px tall, so the page has to clear it
          before its own spacing begins — same reasoning as the article route. */}
      <article className="w-full bg-background pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>
        </div>

        {/* The facts before the name, the way the reference sets them out. */}
        <header className="mx-auto mt-10 max-w-site px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span>{project.location}</span>
            <span aria-hidden="true" className="text-border">&middot;</span>
            <span>{CATEGORY_LABELS[project.category]}</span>
            {project.ongoing ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 tracking-[0.14em] text-background">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-background" />
                Ongoing
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground lg:text-6xl">
            {project.title}
          </h1>

          {project.description ? (
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          ) : null}

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Scope</dt>
              <dd className="mt-1 font-medium text-foreground">{project.scope}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Location</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {project.location}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Photographs</dt>
              <dd className="mt-1 font-medium text-foreground">{gallery.length + 1}</dd>
            </div>
          </dl>
        </header>

        {/* The card image leads. It is already the strongest frame in the set —
            that is how it was picked — and it is the only one that loads
            eagerly; everything below waits until it is scrolled to. */}
        <div className="mx-auto mt-12 max-w-site px-4 sm:px-6 lg:px-8">
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-background-alt"
            style={{ aspectRatio: ratio(project.image) }}
          >
            <Image
              src={mediaUrl(project.image)}
              alt={mediaAlt(project.image, project.title)}
              fill
              sizes="(max-width: 1536px) 100vw, 1472px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Every photograph, down the page. No carousel and no counter —
            scrolling is the interaction. The rhythm runs one full-width frame
            then a pair, which keeps a long gallery from reading as a column of
            identical blocks. Parthiban has 96 of them. */}
        {gallery.length > 0 ? (
          <div className="mx-auto mt-6 max-w-site space-y-6 px-4 sm:px-6 lg:px-8">
            {chunk(gallery).map((group, index) =>
              group.length === 1 ? (
                <figure key={index} className="m-0">
                  <div
                    className="relative w-full overflow-hidden rounded-2xl bg-background-alt"
                    style={{ aspectRatio: ratio(group[0]) }}
                  >
                    <Image
                      src={mediaUrl(group[0])}
                      alt={mediaAlt(group[0], project.title)}
                      fill
                      sizes="(max-width: 1536px) 100vw, 1472px"
                      className="object-cover"
                    />
                  </div>
                </figure>
              ) : (
                <div key={index} className="grid gap-6 sm:grid-cols-2">
                  {group.map((item, i) => (
                    <figure key={i} className="m-0">
                      <div
                        className="relative w-full overflow-hidden rounded-2xl bg-background-alt"
                        style={{ aspectRatio: ratio(item) }}
                      >
                        <Image
                          src={mediaUrl(item)}
                          alt={mediaAlt(item, project.title)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 724px"
                          className="object-cover"
                        />
                      </div>
                    </figure>
                  ))}
                </div>
              ),
            )}
          </div>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="w-full bg-background-alt py-16 lg:py-24">
          <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              More {CATEGORY_LABELS[project.category].toLowerCase()} work
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
                >
                  <div className="relative min-h-60 flex-1 overflow-hidden">
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

/** One full-width frame, then a pair, repeating. */
function chunk(items: MediaField[]): MediaField[][] {
  const groups: MediaField[][] = []
  let i = 0
  while (i < items.length) {
    groups.push(items.slice(i, i + 1))
    i += 1
    if (i < items.length) {
      groups.push(items.slice(i, i + 2))
      i += 2
    }
  }
  return groups
}
