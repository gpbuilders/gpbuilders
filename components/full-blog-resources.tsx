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
  const featuredArticle = BLOG_ARTICLES.find((a) => a.featured)
  const regularArticles = BLOG_ARTICLES.filter((a) => !a.featured)

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Resources
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Blog & News
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay updated with the latest insights, project updates, and industry trends from GP Builders.
          </p>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-20 group cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Featured Image */}
              <div className="relative h-96 lg:h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-4 py-2 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              {/* Featured Content */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-accent/15 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                    {featuredArticle.category}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredArticle.date}
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-6 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{featuredArticle.readTime}</span>
                  <Link
                    href={`/blog/${featuredArticle.id}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularArticles.map((article) => (
            <article
              key={article.id}
              className="group cursor-pointer flex flex-col rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              {/* Article Image */}
              <div className="relative h-56 overflow-hidden bg-background">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Article Content */}
              <div className="flex flex-col justify-between flex-1 p-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent/15 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
