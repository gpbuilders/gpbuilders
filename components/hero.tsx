'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'

export function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const swiperRef = useRef(null)

  // Carousel slides with images and videos
  const slides = [
    {
      type: 'image',
      src: '/interior-hallway.jpg',
      alt: 'Modern interior hallway with terracotta',
    },
    {
      type: 'image',
      src: '/project-living-room.png',
      alt: 'Luxury living room design',
    },
    {
      type: 'image',
      src: '/exterior-render.jpg',
      alt: 'Exterior architectural rendering',
    },
    {
      type: 'image',
      src: '/project-kitchen.png',
      alt: 'Modern kitchen design',
    },
    {
      type: 'image',
      src: '/commercial-restaurant.jpg',
      alt: 'Commercial restaurant design',
    },
  ]

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
            {slide.type === 'image' ? (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={idx === 0}
              />
            ) : (
              <video
                src={slide.src}
                muted={isMuted}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/60 to-dark-bg/40 z-5" />

      {/* Navigation Arrows */}
      <button
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => swiperRef.current?.swiper.slideNext()}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Mute Button for Video */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-8 right-8 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Content Overlay - Full Width */}
      <div className="absolute inset-0 flex items-center justify-start z-10">
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
            className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/80 transition-all"
          />
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
