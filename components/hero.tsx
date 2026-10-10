'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { HeroSlide } from '@/lib/hero-media'
import { Swiper, SwiperSlide, type SwiperRef } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
// Only the two stylesheets this carousel actually uses. Swiper's navigation
// CSS was imported here too, and nothing rendered it: the arrows below are
// our own buttons calling slidePrev/slideNext, which are core methods and do
// not need the Navigation module. It cost 3.2 KB of render-blocking CSS —
// the largest feature block in that chunk — to style elements that were
// never in the markup.
import 'swiper/css'
import 'swiper/css/effect-fade'

/**
 * Both of these are module constants, not literals in the JSX, because their
 * identity is a prop. Swiper re-measures itself whenever it is handed params it
 * does not recognise, and measuring means reading the geometry of a full-bleed
 * element on a 9,000px page. Written inline they were new objects on every
 * render of this component, which has six pieces of state: six re-renders cost
 * six forced layouts, 57.9ms of them under 4x CPU throttling.
 *
 * autoplay starts disabled whatever the slides are. The effect below is what
 * governs it, from `paused` and the reduced-motion preference, and it did so
 * already — having `enabled` in here as well only meant the param object
 * changed every time somebody hit pause.
 */
const SWIPER_MODULES = [Autoplay, EffectFade]
const SWIPER_AUTOPLAY = { enabled: false, delay: 7000, disableOnInteraction: false }

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const swiperRef = useRef<SwiperRef>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [active, setActive] = useState(0)

  /**
   * Which slides are worth downloading yet.
   *
   * The fade effect stacks every slide in the same box, so all five sit inside
   * the viewport at full size from the first paint and `loading="lazy"` holds
   * none of them back. Measured on a 412px viewport without scrolling: five
   * images, 252 KB, to show the 32 KB one. This keeps the first paint to the
   * first slide and widens as the carousel moves.
   *
   * A slide never leaves the set once it is in. Taking its src away again
   * would only make the browser ask for it a second time on the next lap.
   */
  const [eligible, setEligible] = useState<ReadonlySet<number>>(() => new Set([0]))

  // The neighbours are fetched after the page has finished loading rather than
  // during it, so nothing competes with the slide that is actually on screen.
  // There is no hurry: autoplay waits seven seconds before it needs the next one.
  const [loadComplete, setLoadComplete] = useState(false)
  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoadComplete(true)
      return
    }
    const done = () => setLoadComplete(true)
    window.addEventListener('load', done)
    return () => window.removeEventListener('load', done)
  }, [])

  useEffect(() => {
    // Still on the first paint with the first slide showing: nothing to widen to.
    if (!loadComplete && active === 0) return
    setEligible((current) => {
      const count = slides.length
      // Both neighbours, not just the next: fade needs the slide it is moving
      // to already decoded, and the arrows can go either way.
      const next = new Set(current)
      for (const index of [active, (active + 1) % count, (active - 1 + count) % count]) {
        next.add(index)
      }
      return next.size === current.size ? current : next
    })
  }, [active, loadComplete, slides.length])

  // A full-screen autoplaying video is exactly what this setting is for.
  // Read after mount rather than during render, so the server and the first
  // client pass agree and React does not report a hydration mismatch.
  const [reduceMotion, setReduceMotion] = useState(true)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // The control only exists while something can hear it.
  const hasVideo = slides.some((slide) => slide.kind === 'video') && !reduceMotion

  useEffect(() => {
    const stopped = paused || reduceMotion
    const swiper = swiperRef.current?.swiper
    if (swiper) swiper.params.speed = reduceMotion ? 0 : 600
    if (stopped) swiper?.autoplay.stop()
    else swiper?.autoplay.start()
    sectionRef.current?.querySelectorAll('video').forEach(video => {
      if (stopped) video.pause()
      else void video.play().catch(() => {})
    })
  }, [paused, reduceMotion])


  return (
    <section ref={sectionRef} className="relative w-full min-h-svh overflow-hidden sm:h-svh sm:min-h-[800px]">
      {/* Full-width Carousel Background */}
      <Swiper
        ref={swiperRef}
        modules={SWIPER_MODULES}
        effect="fade"
        autoplay={SWIPER_AUTOPLAY}
        // Fixed, and set to 0 on the instance by the effect above when motion
        // is to be reduced. As a prop it changed once on mount — the preference
        // can only be read after hydration — and cost a measure to do it.
        speed={600}
        loop
        // realIndex, not activeIndex: in loop mode the two differ, and this one
        // counts in the same order as the slides prop.
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="!absolute inset-0 w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            {!eligible.has(idx) ? (
              /* Holds the slide's place until it is near enough to be worth the
                 bytes. Same colour as the section behind it, so a slide that
                 has not arrived yet cannot flash light against the hero. */
              <div className="h-full w-full bg-dark-bg" />
            ) : slide.kind === 'video' && !reduceMotion ? (
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
                // The only slide on screen at first paint, and the LCP element.
                priority={idx === 0}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {!reduceMotion && (
        <button type="button" onClick={() => setPaused(value => !value)}
          aria-label={paused ? 'Resume hero animation' : 'Pause hero animation'}
          aria-pressed={paused}
          className="absolute bottom-8 right-6 z-20 flex items-center gap-2 rounded-full bg-black/40 px-4 py-3 text-sm text-white backdrop-blur-sm hover:bg-black/60 sm:right-8">
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}

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
      <div className="relative flex min-h-svh items-center justify-start z-10 pt-28 pb-28 pointer-events-none sm:absolute sm:inset-0 sm:min-h-0 sm:pt-16 sm:pb-24">
        {/* Same inset as the header and every section below, so the headline
              starts on the same left edge as the logo directly above it. */}
        <div className="w-full max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-6">
              Premium Design & Build
            </p>

            {/* Main Heading */}
            <h1 className="font-serif text-[clamp(2.75rem,12vw,3.25rem)] sm:text-7xl lg:text-8xl font-semibold leading-tight text-white mb-6">
              Spaces
              <br />
              <span className="text-accent">Built to Last</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg font-light">
              Award-winning architecture, interior design, and construction. We transform visions into reality with precision, creativity, and timeless craftsmanship for residential and commercial spaces.
            </p>

            {/* CTA Buttons */}
            {/* w-fit on the stacked layout, so the column is only as wide as its
                widest label rather than the whole content block — full-bleed
                pills were 468px of a 468px column on a phone. The items still
                stretch inside it, so both buttons come out the same width
                without either one being given a number to hold to. */}
            <div className="flex w-fit flex-col gap-4 mb-8 pointer-events-auto sm:mb-16 sm:w-auto sm:flex-row">
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
              <Link href="#what-we-do" className="h-14 px-8 text-base font-semibold gap-3 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white/10 transition-all hover:border-accent">
                <Play className="h-5 w-5 fill-white" />
                Watch Process
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 sm:gap-12 pt-8 border-t border-white/20">
              {[
                { number: '9+', label: 'Full Construction Projects' },
                { number: '20+', label: 'Interior Projects Delivered' },
                { number: '100%', label: 'Commitment to Quality' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl sm:text-4xl font-semibold text-accent font-serif">
                    {stat.number}
                  </p>
                  <p className="text-xs sm:text-sm text-white/80 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {/* gap-5 (20px), not gap-2. Each button is a 24px hit area (-m-2 p-2
          around an 8px dot) but the negative margin collapses its layout box
          back to 8px, so at gap-2 the centres sat 16px apart and the hit areas
          overlapped — so Lighthouse measured the usable area as 16x24 and failed it. 20px of gap puts the
          centres 28px apart. The dots themselves are unchanged. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-5">
        {slides.map((_, idx) => {
          const current = idx === active
          return (
            <button
              key={idx}
              // slideToLoop, not slideTo. In loop mode Swiper's own index drifts
              // away from the one these dots are numbered by: after enough laps
              // activeIndex read 3 while realIndex read 0, and every dot sent you
              // two slides past the one it named. slideToLoop counts the way the
              // slides prop does.
              onClick={() => swiperRef.current?.swiper.slideToLoop(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={current ? 'true' : undefined}
              className="group -m-2 p-2"
            >
              {/* Wider rather than larger: the row keeps its height, so marking
                  the current slide cannot nudge anything around it. */}
              <span
                className={`block h-2 rounded-full transition-all motion-reduce:transition-none ${
                  current ? 'w-6 bg-white' : 'w-2 bg-white/40 group-hover:bg-white/80'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 z-10 hidden lg:block">
        <div className="flex flex-col items-center gap-3 text-white/60">
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
