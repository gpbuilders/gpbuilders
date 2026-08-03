'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface BlogArticle {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  readTime: string
  featured?: boolean
}

const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: '1',
    title: 'Sustainable Design: Building for Tomorrow',
    excerpt: 'Explore how eco-friendly materials and sustainable practices are reshaping the architecture industry and creating healthier living spaces.',
    category: 'Sustainability',
    date: 'Aug 15, 2024',
    readTime: '5 min read',
    image: '/spec-residential.png',
    featured: true,
  },
  {
    id: '2',
    title: 'Interior Design Trends 2024',
    excerpt: 'Discover the latest color palettes, furniture styles, and spatial arrangements that are defining modern interior design this year.',
    category: 'Design',
    date: 'Aug 12, 2024',
    readTime: '4 min read',
    image: '/project-living-room.png',
  },
  {
    id: '3',
    title: 'Project Update: New Residential Complex',
    excerpt: 'Behind the scenes look at our latest 50-unit residential project featuring sustainable design and modern architecture.',
    category: 'Projects',
    date: 'Aug 10, 2024',
    readTime: '6 min read',
    image: '/spec-commercial.png',
  },
  {
    id: '4',
    title: 'The Art of Space Planning',
    excerpt: 'Learn how optimal space planning can transform any area into a functional and beautiful environment for work or living.',
    category: 'Architecture',
    date: 'Aug 8, 2024',
    readTime: '4 min read',
    image: '/spec-retail.png',
  },
  {
    id: '5',
    title: 'Material Innovation in Construction',
    excerpt: 'Exploring cutting-edge materials that are revolutionizing the construction industry with durability and aesthetic appeal.',
    category: 'Innovation',
    date: 'Aug 5, 2024',
    readTime: '7 min read',
    image: '/spec-landscape.png',
  },
  {
    id: '6',
    title: 'Residential vs Commercial: Design Differences',
    excerpt: 'Understanding the key differences in approach, regulations, and design philosophy between residential and commercial projects.',
    category: 'Architecture',
    date: 'Aug 1, 2024',
    readTime: '5 min read',
    image: '/spec-industrial.png',
  },
]

export function FullBlogResources() {
  const regularArticles = BLOG_ARTICLES

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Articles Grid - 2x2 + 2 layout */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {regularArticles.map((article, index) => (
            <article
              key={article.id}
              className={cn(
                'group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300',
                index === 0 || index === 3 ? 'lg:col-span-1' : 'lg:col-span-1',
              )}
            >
              {/* Background Image */}
              <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden bg-background">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Overlay Card */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-semibold text-foreground">
                      Discover
                    </span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/blog/${article.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-foreground text-white rounded-full font-semibold text-sm hover:bg-foreground/90 transition-colors"
                  >
                    Detail Article
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
