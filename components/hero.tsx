'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Background Images Grid - Right Side */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute right-0 top-0 w-3/5 h-full">
          <div className="grid grid-cols-2 gap-3 h-full p-6">
            {/* Left column - tall image */}
            <div className="col-span-1 row-span-2">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/interior-hallway.jpg"
                  alt="Modern interior hallway"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right column - two images stacked */}
            <div className="col-span-1 flex flex-col gap-3">
              <div className="relative w-full h-1/2 rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/project-living-room.png"
                  alt="Luxury living room design"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="relative w-full h-1/2 rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/exterior-render.jpg"
                  alt="Exterior architectural design"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/50 to-transparent" />
      </div>

      {/* Content Overlay - Left Side */}
      <div className="absolute inset-0 flex items-center justify-start z-10">
        <div className="w-3/5 px-8 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-6">
              Premium Design & Build
            </p>

            {/* Main Heading */}
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-semibold leading-tight text-white mb-6">
              Spaces
              <br />
              <span className="text-accent">Built to Last</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg font-light">
              Award-winning architecture, interior design, and construction. We transform visions into reality with precision, creativity, and timeless craftsmanship for residential and commercial spaces.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/projects"
                className={cn(
                  buttonVariants(),
                  'h-14 px-8 text-base font-semibold gap-3 bg-primary hover:bg-primary-dark text-primary-foreground rounded-full transition-all hover:shadow-lg',
                )}
              >
                Explore Our Work
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="h-14 px-8 text-base font-semibold gap-3 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white/10 transition-all hover:border-accent">
                <Play className="h-5 w-5 fill-white" />
                Watch Process
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-12 pt-8 border-t border-white/20">
              {[
                { number: '15+', label: 'Years Experience' },
                { number: '500+', label: 'Projects Completed' },
                { number: '98%', label: 'Client Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-semibold text-accent font-serif">
                    {stat.number}
                  </p>
                  <p className="text-sm text-white/60 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/4 z-10">
        <div className="flex flex-col items-center gap-3 text-white/60 animate-bounce">
          <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
