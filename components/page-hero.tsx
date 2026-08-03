'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export function PageHero({
  eyebrow,
  title,
  description,
  currentLabel,
}: {
  eyebrow: string
  title: string
  description: string
  currentLabel: string
}) {
  return (
    <section className="relative w-full min-h-[600px] overflow-hidden bg-dark-bg">
      {/* Hand-drawn architecture background - transparent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-15 pointer-events-none">
        <Image
          src="/architecture-transparent.png"
          alt="Architecture sketch"
          fill
          className="object-cover object-right"
        />
      </div>

      {/* Content Grid Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="col-span-1 lg:col-span-2">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-3 text-sm mb-12"
            >
              <Link href="/" className="text-white/60 transition-colors hover:text-white font-medium">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-white/40" />
              <span className="font-semibold text-accent">{currentLabel}</span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1.5 w-8 bg-accent" />
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </p>
            </div>

            {/* Bold Heading - Multiple lines for impact */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.1] text-white mb-10 tracking-tight">
              {title}
            </h1>

            {/* Description paragraph - can be multi-line */}
            <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl font-light mb-8">
              {description}
            </p>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="col-span-1 hidden lg:block">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <p className="text-white/70 text-sm leading-relaxed">
                At GP Builders, we merge innovation with timeless design to create spaces that inspire and endure. Our architecture balances aesthetics, functionality, and sustainability for a better future.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mt-4">
                With a passion for pushing boundaries, we embrace cutting-edge technology and visionary thinking. Every project transforms the way people live, work, and connect.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Icons */}
      <div className="absolute bottom-8 left-8 sm:left-12 lg:left-16 flex gap-4 z-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
          </svg>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.58 4.58 4.58 4.58L16 19.74 9.04 12.78 16 5.82v.18zM2 12a10 10 0 1120 0 10 10 0 01-20 0z" />
          </svg>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>
    </section>
  )
}
