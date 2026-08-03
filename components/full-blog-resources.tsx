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
        {/* Articles Grid - Masonry layout with variable sizes */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {regularArticles.map((article, index) => {
            // First 2 articles are larger (2 cols wide, taller)
            // Next 2 are regular, Last 2 are regular
            const isLarge = index < 2
            
            return (
              <article
                key={article.id}
                className={cn(
                  'group cursor-pointer relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300',
                  isLarge ? 'md:col-span-2 h-96 md:h-[500px] lg:h-[500px]' : 'h-80 md:h-96 col-span-1',
                )}
              >
                {/* Background Image */}
                <div className="relative w-full h-full overflow-hidden bg-background">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Overlay Card - positioned at bottom-left */}
                <div className={cn(
                  'absolute p-6 md:p-8 transition-all duration-300',
                  isLarge ? 'bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10' : 'bottom-6 left-6 right-6'
                )}>
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="mb-3 inline-block">
                      <span className="text-xs font-semibold text-foreground tracking-widest uppercase">
                        Discover
                      </span>
                    </div>
                    <h3 className={cn(
                      'font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors',
                      isLarge ? 'text-2xl lg:text-3xl line-clamp-2' : 'text-lg md:text-xl line-clamp-2'
                    )}>
                      {article.title}
                    </h3>
                    {isLarge && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6">
                        {article.excerpt}
                      </p>
                    )}
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-white rounded-full font-semibold text-sm hover:bg-foreground/90 transition-colors">
                      Detail Article
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
