'use client'

import { useEffect, useId, useRef } from 'react'
import styles from './how-we-deliver.module.css'
// See what-we-do.tsx: imported so the CDN can cache it immutably, and WebP
// rather than PNG — the alpha channel survives the conversion untouched.
import blueprint from '@/assets/delivery-blueprint.webp'

const MARKERS = [
  { x: 134, y: 343, radius: 52 },
  { x: 389, y: 305, radius: 52 },
  { x: 625, y: 305, radius: 52 },
  { x: 857, y: 305, radius: 52 },
  { x: 1072, y: 310, radius: 53 },
  { x: 1395, y: 380, radius: 49 },
]

function Roadmap() {
  const id = useId()
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const markers = svg.querySelectorAll<SVGGElement>('[data-marker]')
    let frame = 0
    let visible = false
    const update = () => {
      frame = 0
      // Nothing to animate for someone who asked not to be animated at, so
      // this settles the markers and returns before reading any geometry.
      if (reduced.matches) {
        markers.forEach((marker) => {
          marker.style.transform = 'translateY(0)'
          marker.style.opacity = '1'
        })
        return
      }
      const progress = (window.innerHeight * .95 - svg.getBoundingClientRect().top) / (window.innerHeight * .65)
      markers.forEach((marker, index) => {
        const t = Math.max(0, Math.min(1, (progress - index * .09) / .5))
        const eased = 1 - Math.pow(1 - t, 3)
        marker.style.transform = `translateY(${-180 * (1 - eased)}px)`
        marker.style.opacity = String(Math.min(1, t * 4))
      })
    }
    // Gated the way what-we-do.tsx gates its own scroll animation. Every scroll
    // anywhere on a 9,000px page used to reach update(), and getBoundingClientRect
    // after the page has been touched makes the browser lay the whole thing out
    // before it can answer — for a roadmap that is usually nowhere near the
    // screen. The reduced-motion branch is let through because it reads no
    // geometry and still has to settle the markers.
    const schedule = () => {
      if ((visible || reduced.matches) && !frame) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
    }, { rootMargin: '150px' })
    observer.observe(svg)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    // The markers' start state is in the stylesheet, so nothing here has to
    // beat the first paint. The observer delivers a first callback of its own,
    // which covers the case of landing on the section directly; this call is
    // what reveals the markers when motion is reduced.
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <div className={styles.roadContainer}>
      <svg ref={ref} viewBox="0 35 1672 555" className={styles.road} aria-hidden="true" focusable="false">
        <defs>
          <mask id={`${id}-road`} maskUnits="userSpaceOnUse" x="0" y="35" width="1672" height="555">
            <rect x="0" y="35" width="1672" height="555" fill="white" />
            {MARKERS.map(({ x, y, radius }, index) => <circle key={index} cx={x} cy={y} r={radius} fill="black" />)}
          </mask>
          {MARKERS.map(({ x, y, radius }, index) => (
            <clipPath key={index} id={`${id}-marker-${index}`}><circle cx={x} cy={y} r={radius} /></clipPath>
          ))}
        </defs>
        <image href={blueprint.src} width={blueprint.width} height={blueprint.height} mask={`url(#${id}-road)`} />
        {MARKERS.map((_, index) => (
          <g key={index} data-marker>
            <image href={blueprint.src} width={blueprint.width} height={blueprint.height} clipPath={`url(#${id}-marker-${index})`} />
          </g>
        ))}
      </svg>
    </div>
  )
}

const STEPS = [
  { title: 'Project planning', points: ['Define scope & goals', 'Set key milestones'], crop: '85 600 175 190' },
  { title: 'Weekly reviews', points: ['Track site progress', 'Resolve issues early'], crop: '315 600 185 190' },
  { title: 'Leadership inspections', points: ['Twice-weekly MD visits', 'Check quality & progress'], crop: '535 600 250 190' },
  { title: 'Engineering-led sites', points: ['Expert supervision', 'Coordinate every detail'], crop: '840 600 170 190' },
  { title: 'Quality checks', points: ['Inspect every stage', 'Maintain high standards'], crop: '1060 600 310 190' },
  { title: 'On-time delivery', points: ['Proactive planning', 'Timely handover'], crop: '1400 600 180 190' },
] as const

// Reuse regions of one transparent illustration. All meaningful content is HTML.
function BlueprintArt({ viewBox, className }: { viewBox: string; className: string }) {
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  const clipId = `delivery-art-${x}-${y}`
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false">
      <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
      <image href={blueprint.src} width={blueprint.width} height={blueprint.height} clipPath={`url(#${clipId})`} />
    </svg>
  )
}

export function HowWeDeliver() {
  return (
    <section aria-labelledby="delivery-heading" className={`${styles.section} bg-background-alt px-4 py-12 sm:px-6 lg:px-0 lg:py-16`}>
      <div className={styles.blueprint}>
        <div className={styles.journey}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Our approach</p>
            <h2 id="delivery-heading" className={styles.title}>How we deliver</h2>
            <p className={styles.intro}>Plan strategically. Execute precisely.</p>
          </header>
          <Roadmap />
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <h3 className={styles.stepTitle}>
                <span className={styles.number}>{index + 1}.</span>{step.title}
              </h3>
              <BlueprintArt viewBox={step.crop} className={styles.icon} />
              <ul className={styles.points}>
                {step.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </li>
          ))}
        </ol>
        <footer className={styles.footer}>
          <p className={styles.plate}>A six-step building journey</p>
          <div className={styles.stamp}>
            <div><span>Built by</span><strong>GP Builders</strong></div>
            <div><span>Our promise</span><strong>Quality &amp; value</strong></div>
            <svg viewBox="0 0 60 76" aria-hidden="true" className={styles.compass}>
              <text x="30" y="12" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10">N</text>
              <circle cx="30" cy="46" r="21" />
              <path d="M30 18 36 40 56 46 36 52 30 74 24 52 4 46 24 40Z M30 18V74 M4 46H56 M15 31 45 61 M45 31 15 61" />
            </svg>
          </div>
        </footer>
      </div>
    </section>
  )
}
