'use client'

import { useEffect, useRef } from 'react'
import { Armchair, Building2, DraftingCompass } from 'lucide-react'

const STATS = [
  { value: 12, icon: DraftingCompass, label: 'Years in Construction & Interiors', description: 'Hands-on industry experience behind every project' },
  { value: 9, icon: Building2, label: 'Construction Projects', description: 'Complete builds delivered from ground up' },
  { value: 20, icon: Armchair, label: 'Interior Projects', description: 'From modular kitchens to full home interiors' },
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
    <div ref={ref} className="py-8 first:pt-0 last:pb-0 md:px-5 md:py-0 md:first:pl-0 md:last:pr-0 lg:px-10">
      <div className="mb-6 flex items-center justify-between gap-4 text-primary">
        <p className="flex items-start gap-1 font-serif text-[72px] leading-none tracking-tight lg:text-[88px]" aria-label={`${stat.value} plus`}>
          <span ref={numberRef} aria-hidden="true" className="tabular-nums">{stat.value}</span>
          <span aria-hidden="true" className="mt-1 font-sans text-4xl font-light">+</span>
        </p>
        <Icon aria-hidden="true" strokeWidth={1.35} className="h-14 w-14 shrink-0 lg:h-16 lg:w-16" />
      </div>
      <h3 className="mb-3 max-w-[24ch] text-lg font-medium leading-snug text-foreground md:min-h-[50px]">{stat.label}</h3>
      <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground">{stat.description}</p>
    </div>
  )
}

export function AboutStats() {
  return (
    <section aria-labelledby="about-stats-heading" className="bg-background-alt py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">Experience. Craftsmanship. Trust.</p>
        <h2 id="about-stats-heading" className="mb-10 font-serif text-3xl font-normal text-foreground lg:mb-12 lg:text-4xl">A foundation you can count on.</h2>
        <div className="grid grid-cols-1 divide-y divide-primary/20 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map(stat => <Stat key={stat.label} stat={stat} />)}
        </div>
      </div>
    </section>
  )
}
