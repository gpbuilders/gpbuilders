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
    <section className="relative w-full h-96 overflow-hidden bg-dark-bg">
      {/* Background Image Grid - Shows project images */}
      <div className="absolute inset-0 w-full h-full">
        <div className="grid grid-cols-3 gap-2 w-full h-full p-4">
          <div className="col-span-1 rounded-2xl overflow-hidden">
            <Image
              src="/interior-hallway.jpg"
              alt="Project showcase"
              fill
              className="object-cover"
            />
          </div>
          <div className="col-span-1 rounded-2xl overflow-hidden">
            <Image
              src="/project-living-room.png"
              alt="Project showcase"
              fill
              className="object-cover"
            />
          </div>
          <div className="col-span-1 rounded-2xl overflow-hidden">
            <Image
              src="/exterior-render.jpg"
              alt="Project showcase"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/70 to-dark-bg/40 z-5" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between z-10 px-8 sm:px-12 lg:px-16 py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-white/70"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-white">{currentLabel}</span>
        </nav>

        {/* Main Content */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">
            {eyebrow}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight text-white mb-6">
            {title}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-xl font-light">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
