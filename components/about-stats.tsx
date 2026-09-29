'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Armchair, Building2, DraftingCompass, ArrowUpRight } from 'lucide-react'

const STATS = [
  { value: 12, icon: DraftingCompass, label: 'Years in Construction & Interiors' },
  { value: 9, icon: Building2, label: 'Construction Projects' },
  { value: 20, icon: Armchair, label: 'Interior Projects' },
] as const

function Stat({ stat }: { stat: (typeof STATS)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    const number = numberRef.current
    if (!element || !number) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches || !('IntersectionObserver' in window)) return
    let frame = 0
    let finished = false
    const finish = () => {
      cancelAnimationFrame(frame)
      number.textContent = String(stat.value)
      finished = true
    }
    const onPreferenceChange = () => { if (reduced.matches) finish() }
    number.textContent = '0'
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || finished) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1400)
        number.textContent = String(Math.round(stat.value * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
        else finish()
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.35 })
    observer.observe(element)
    reduced.addEventListener('change', onPreferenceChange)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      reduced.removeEventListener('change', onPreferenceChange)
    }
  }, [stat.value])

  const Icon = stat.icon
  return (
    <div ref={ref} className="min-w-0 px-2 first:pl-0 last:pr-0 lg:px-4">
      <div className="mb-2 flex items-center justify-center gap-2 text-primary lg:gap-3">
        <Icon aria-hidden="true" strokeWidth={1.35} className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
        <p className="flex items-start gap-1 font-serif text-[40px] leading-none tracking-tight lg:text-[48px]" aria-label={`${stat.value} plus`}>
          <span ref={numberRef} aria-hidden="true" className="tabular-nums">{stat.value}</span>
          <span aria-hidden="true" className="mt-1 font-sans text-xl font-light">+</span>
        </p>
      </div>
      <h3 className="mx-auto max-w-[24ch] text-center text-xs font-medium leading-snug text-foreground lg:text-sm">{stat.label}</h3>
    </div>
  )
}

export function AboutStats() {
  return (
    <section aria-labelledby="about-stats-heading" className="bg-background-alt py-14 lg:py-16">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">Experience. Craftsmanship. Trust.</p>
        <h2 id="about-stats-heading" className="mb-10 scroll-mt-24 font-serif text-3xl font-normal text-foreground lg:mb-12 lg:text-4xl">A foundation you can count on.</h2>
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-10 lg:gap-16">
          <figure className="mx-auto w-full max-w-sm md:mx-0">
            <Image
              src="/vignesh-chandrasekaran.webp"
              alt="Vignesh Chandrasekaran, founder and proprietor of GP Builders"
              width={640}
              height={640}
              sizes="(max-width: 767px) 90vw, 384px"
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <figcaption className="mt-5">
              <p className="font-serif text-2xl text-foreground">Vignesh Chandrasekaran</p>
              <p className="mt-1 text-sm text-muted-foreground">Founder &amp; Proprietor, GP Builders</p>
              <a href="https://www.linkedin.com/in/vignesh-chandrasekaran-8b432843a" target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-primary hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                Connect on LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
          <div>
            <h3 className="mb-5 font-serif text-2xl text-foreground lg:text-3xl">A message from our founder</h3>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:text-lg">
              <p>I founded GP Builders in 2021 with a clear vision: to create refined homes and interiors defined by quality, precision, and timeless design.</p>
              <p>We approach each project as a signature creation, tailored to our clients’ lifestyles and aspirations. From material selection to finishing, we bring careful planning, skilled craftsmanship, and attention to the details that unite design, functionality, and durability.</p>
              <p>I stay personally involved at every stage, coordinating our teams, overseeing quality, and working closely with clients. For me, a successful project delivers more than a beautiful space—it creates comfort, lasting value, and a relationship built on trust.</p>
            </div>
            <div className="mt-7 grid grid-cols-3 divide-x divide-primary/20 border-t border-primary/20 pt-6 lg:mt-8">
              {STATS.map(stat => <Stat key={stat.label} stat={stat} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
