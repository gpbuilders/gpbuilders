'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { HeroSlide } from '@/lib/hero-media'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const swiperRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  // A full-screen autoplaying video is exactly what this setting is for.
  // Read after mount rather than during render, so the server and the first
  // client pass agree and React does not report a hydration mismatch.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // The control only exists while something can hear it.
  const hasVideo = slides.some((slide) => slide.kind === 'video') && !reduceMotion


  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Full-width Carousel Background */}
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="absolute inset-0 w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            {slide.kind === 'video' && !reduceMotion ? (
              <video
                key={slide.src}
                src={slide.src}
                poster={slide.poster}
                aria-label={slide.alt}
                muted={isMuted}
                autoPlay
                loop
                playsInline
                // The poster is a real image and carries the first paint;
                // metadata is enough to start, the rest streams.
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={slide.kind === 'video' ? slide.poster : slide.src}
                alt={slide.alt}
                fill
                // Full-bleed at every size, so the browser always wants the
                // widest source it can get.
                sizes="100vw"
                className="object-cover"
                priority={idx === 0}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {hasVideo && (
        /* Sits clear of the fixed header (~64px tall) rather than level with
           the menu button, which made the two easy to hit by mistake. */
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!isMuted}
          className="absolute top-24 right-6 z-20 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:right-8"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/60 to-dark-bg/40 z-5" />

      {/* Navigation Arrows */}
      <button
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        aria-label="Previous slide"
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all lg:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => swiperRef.current?.swiper.slideNext()}
        aria-label="Next slide"
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all lg:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content Overlay - Full Width.
          pt-16 keeps the centring from counting the space behind the fixed
          header, which otherwise pushes the eyebrow up against it. */}
      <div className="absolute inset-0 flex items-center justify-start z-10 pt-16 pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
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
            <div className="flex flex-col sm:flex-row gap-4 mb-16 pointer-events-auto">
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
                { number: '9+', label: 'Full Construction Projects' },
                { number: '20+', label: 'Interior Projects Delivered' },
                { number: '100%', label: 'Commitment to Quality' },
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

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => swiperRef.current?.swiper.slideTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="group -m-2 p-2"
          >
            <span className="block w-2 h-2 rounded-full bg-white/40 transition-all group-hover:bg-white/80" />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
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
