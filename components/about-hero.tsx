'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AboutStats } from '@/components/about-stats'
import type { HeroSlide } from '@/lib/hero-media'

export function AboutHero({ sketch }: { sketch: HeroSlide }) {
  return (
    <>
      {/* Main Hero Section */}
      <section className="relative w-full overflow-hidden bg-background">
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Architectural Sketch */}
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src={sketch.src}
                alt={sketch.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center max-w-2xl">
              {/* Eyebrow */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                <span className="inline-flex gap-1">
                  <span className="w-0.5 h-0.5 bg-primary rounded-full" />
                  <span className="w-0.5 h-0.5 bg-primary rounded-full" />
                  <span className="w-0.5 h-0.5 bg-primary rounded-full" />
                </span>
                Design & Build Excellence
              </p>

              {/* Main Heading */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight text-foreground mb-6">
                GP Builders
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                We merge innovation with timeless design to create spaces that inspire and endure. Our architecture balances aesthetics, functionality, and sustainability for a better future.
              </p>

              {/* Single CTA, so no row/column switching to do — buttonVariants
                  already makes the link inline-flex. */}
              <div className="mb-12">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants(),
                    'h-12 px-8 text-base font-semibold gap-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg transition-all',
                  )}
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Contact Info */}
              <div className="flex items-start gap-4 pb-12 border-b border-border">
                <BriefcaseBusiness aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ready to Build?</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your vision and let's create something extraordinary together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutStats />
    </>
  )
}
