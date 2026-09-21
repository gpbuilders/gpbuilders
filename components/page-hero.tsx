'use client'

import Image from 'next/image'
import type { HeroSlide } from '@/lib/hero-media'

export function PageHero({
  eyebrow,
  title,
  description,
  art,
  showFeatureIcons = true,
}: {
  eyebrow: string
  title: string
  description: string
  art: HeroSlide
  showFeatureIcons?: boolean
}) {
  return (
    <section className="relative w-full lg:min-h-[600px] overflow-hidden bg-dark-bg">
      {/* Content Grid Layout */}
      <div className="relative z-20 mx-auto max-w-site px-4 sm:px-6 lg:px-8 pt-28 pb-0 lg:py-28 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Main Content */}
          <div className="col-span-1">
            {/* Eyebrow */}
            <p className="mb-8 text-xs uppercase tracking-[0.28em] text-accent">
              {eyebrow}
            </p>

            {/* Bold Heading - Multiple lines for impact */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.1] text-white mb-10 tracking-tight">
              {title}
            </h1>

            {/* Description paragraph - can be multi-line */}
            <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-2xl font-light lg:mb-8">
              {description}
            </p>
          </div>


        </div>
      </div>

      {/* Mobile artwork follows the copy; desktop retains the right-side backdrop. */}
      <div className="relative mx-auto mt-6 mb-8 h-[clamp(200px,58vw,280px)] w-[82%] max-w-md pointer-events-none opacity-80 lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:h-auto lg:w-1/2 lg:max-w-none lg:opacity-60">
        <Image
          src={art.src}
          alt={art.alt}
          fill
          sizes="(max-width: 1023px) 82vw, (max-width: 1280px) 50vw, 640px"
          className="object-contain object-center lg:object-right"
        />
      </div>

      {/* Bottom Feature Icons */}
      {showFeatureIcons && <div className="absolute bottom-8 left-8 sm:left-12 lg:left-16 flex gap-4 z-10">
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
      </div>}
    </section>
  )
}
