import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, formatPostDate } from '@/lib/posts'
import { mediaAlt, mediaUrl } from '@/lib/media'
import type { Post } from '@/payload-types'

export function FullBlogResources({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Nothing published yet
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We&apos;re writing up what we&apos;ve learned on site. Check back
            shortly, or{' '}
            <Link href="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">
              get in touch
            </Link>{' '}
            if there&apos;s something specific you&apos;d like to know.
          </p>
        </div>
      </section>
    )
  }

  // Featured posts lead, and each takes a double-width tile. Sorting them to
  // the front is what keeps the grid whole: a wide tile placed part-way through
  // a four-column row cannot fit beside what precedes it, and CSS grid leaves
  // the gap rather than reflowing around it.
  const ordered = [...posts].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  )

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {ordered.map((post, index) => {
            const isLarge = Boolean(post.featured)

            return (
              <Link
                key={post.id}
                href={`/resources/${post.slug}`}
                className={cn(
                  'group relative block overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isLarge
                    ? 'h-96 md:col-span-2 md:h-[500px]'
                    : 'col-span-1 h-80 md:h-96',
                )}
              >
                <div className="relative h-full w-full overflow-hidden bg-background">
                  <Image
                    src={mediaUrl(post.coverImage)}
                    alt={mediaAlt(post.coverImage, post.title)}
                    fill
                    sizes={
                      isLarge
                        ? '(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 640px'
                        : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px'
                    }
                    // The first tiles are above the fold on every viewport.
                    priority={index < 2}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div
                  className={cn(
                    'absolute transition-all duration-300',
                    isLarge
                      ? 'bottom-8 left-8 right-8 p-6 md:bottom-10 md:left-10 md:right-10 md:p-8'
                      : 'bottom-4 left-4 right-4',
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl bg-white/95 shadow-xl backdrop-blur-md',
                      isLarge ? 'p-6 md:p-8' : 'p-5',
                    )}
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {CATEGORY_LABELS[post.category]}
                    </span>
                    <h3
                      className={cn(
                        'mt-3 font-serif font-semibold text-foreground transition-colors group-hover:text-primary',
                        isLarge
                          ? 'line-clamp-2 text-2xl lg:text-3xl'
                          : 'line-clamp-3 text-lg lg:text-base',
                      )}
                    >
                      {post.title}
                    </h3>
                    {isLarge && (
                      <p className="mb-6 mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div
                      className={cn(
                        'flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground',
                        isLarge ? 'mb-6' : 'mb-4 mt-3',
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <time dateTime={post.publishedAt}>
                          {formatPostDate(post.publishedAt)}
                        </time>
                      </span>
                      {post.readTime ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime} min read
                        </span>
                      ) : null}
                    </div>
                    {/* A span, not a button: the whole card is already the
                        link, and a button nested in an anchor is invalid. */}
                    <span className="inline-flex whitespace-nowrap rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-primary">
                      Read article
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
