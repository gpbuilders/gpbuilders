import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import config from '@payload-config'
import { getPayload } from 'payload'

import { ArticleBody } from '@/components/article-body'
import { CtaBand } from '@/components/cta-band'
import { CATEGORY_LABELS, formatPostDate } from '@/lib/posts'
import { mediaAlt, mediaUrl } from '@/lib/media'

type Params = { params: Promise<{ slug: string }> }

async function findPost(slug: string) {
  const payload = await getPayload({ config })
  // depth 1 populates coverImage.
  //
  // overrideAccess defaults to TRUE on the Local API — it assumes server-side
  // code is trusted. Turning it off is what applies the collection's read rule
  // and keeps a draft from being served to anyone who knows its URL.
  const { docs } = await payload.find({
    collection: 'posts',
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
    collection: 'posts',
    depth: 0,
    limit: 200,
    where: { _status: { equals: 'published' } },
    select: { slug: true },
  })

  return docs.flatMap((post) => (post.slug ? [{ slug: post.slug }] : []))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await findPost(slug)

  if (!post) {
    return { title: 'Article not found | GP Builders' }
  }

  const image = mediaUrl(post.coverImage, '')

  return {
    title: `${post.title} | GP Builders`,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const post = await findPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* The site header is fixed and ~64px tall, so the article has to clear
          it before its own spacing begins — same reasoning as MinimalHero. */}
      <article className="w-full bg-background pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {CATEGORY_LABELS[post.category]}
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            </span>
            {post.readTime ? (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            ) : null}
            {post.author ? <span>By {post.author}</span> : null}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-background-alt">
            <Image
              src={mediaUrl(post.coverImage)}
              alt={mediaAlt(post.coverImage, post.title)}
              fill
              // Full width up to the 5xl container (1024px), so ask for a
              // source no larger than the slot actually is.
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl px-4 sm:px-6 lg:px-8">
          <ArticleBody content={post.content} />
        </div>
      </article>

      <CtaBand />
    </>
  )
}
