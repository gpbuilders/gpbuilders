'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import styles from './what-we-do.module.css'

const SERVICES = [
  {
    title: 'Architectural Design',
    label: 'Imagine',
    description: 'Visionary designs that blend aesthetics with functionality, tailored to your space and lifestyle.',
    detail: 'Every space begins with a considered line.',
    crop: [0, 0, 691, 680],
    alt: 'Architectural drawing of a contemporary villa with a stone pier, recessed balcony and open living room.',
  },
  {
    title: 'Construction',
    label: 'Build',
    description: 'Precise on-site delivery and finishing, backed by transparent timelines and rigorous quality oversight.',
    detail: 'The vision takes shape. Detail by detail.',
    crop: [700, 0, 691, 680],
    alt: 'The same villa completed in ivory plaster, sandstone and bronze-framed glazing.',
  },
  {
    title: 'Interior Design',
    label: 'Live',
    description: 'Curated interiors using premium materials and expert craftsmanship to transform spaces.',
    detail: 'Step inside. Feel the difference.',
    crop: [1398, 0, 689, 680],
    alt: 'Inside the villa: a cream sofa, walnut coffee table, teal armchair and warm oak cabinetry.',
  },
] as const

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start))
const ease = (value: number) => value * value * (3 - 2 * value)

// The approved storyboard is an atlas, not a visible strip of cards. Each SVG
// exposes only one uncaptioned frame; all three occupy the same scene viewport.
function VillaFrame({ index }: { index: number }) {
  const id = useId()
  const { crop: [x, y, width, height], alt } = SERVICES[index]
  return (
    <svg viewBox={`${x} ${y} ${width} ${height}`} className={styles.frame} role="img" aria-label={alt}>
      <defs><clipPath id={id}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
      <image href="/images/services-villa-storyboard.png" width="2087" height="754" clipPath={`url(#${id})`} />
    </svg>
  )
}

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = true

    const update = () => {
      frame = 0
      if (reduced.matches) return
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - stage.offsetHeight)
      // Account for the fixed site navigation and the sticky stage's top inset.
      const progress = clamp((64 - rect.top) / distance)
      const build = ease(range(progress, 0.24, 0.49))
      const enter = ease(range(progress, 0.60, 0.85))
      const interior = ease(range(progress, 0.73, 0.88))
      const draw = ease(range(progress, 0, 0.20))
      stage.style.setProperty('--draw', `${12 + draw * 88}%`)
      stage.style.setProperty('--build', String(build))
      stage.style.setProperty('--exterior-opacity', String(1 - interior))
      stage.style.setProperty('--camera-scale', String(1 + enter * 1.7))
      stage.style.setProperty('--interior', String(interior))
      stage.style.setProperty('--interior-scale', String(1.12 - ease(range(progress, 0.73, 1)) * 0.12))
      setActive(progress < 0.34 ? 0 : progress < 0.74 ? 1 : 2)
    }
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
    }, { rootMargin: '150px' })
    observer.observe(section)
    const resize = new ResizeObserver(schedule)
    resize.observe(section)
    resize.observe(stage)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
    }
  }, [])

  const goToStage = (index: number) => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const progress = [0.20, 0.54, 0.96][index]
    const top = window.scrollY + section.getBoundingClientRect().top - 64
    window.scrollTo({
      top: top + (section.offsetHeight - stage.offsetHeight) * progress,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <section ref={sectionRef} id="what-we-do" aria-labelledby="services-heading" className={styles.section}>
      <div ref={stageRef} className={styles.stage}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>One vision. Every detail.</p>
          <h2 id="services-heading">What We Do</h2>
          <p className={styles.summary}>From the first line to the space you call home.</p>
        </header>

        <div className={styles.scene} aria-hidden="true">
          <div className={styles.drawing}><VillaFrame index={0} /></div>
          <div className={styles.exterior}><VillaFrame index={1} /></div>
          <div className={styles.interior}><VillaFrame index={2} /></div>
          <div className={styles.sceneBlend} />
        </div>

        <div className={styles.copy}>
          {SERVICES.map((service, index) => (
            <div key={service.title} className={styles.chapter} data-active={active === index} aria-hidden={active !== index}>
              <p className={styles.chapterNumber}>0{index + 1} <span>/ {service.label}</span></p>
              <h3>{service.title}</h3>
              <p className={styles.detail}>{service.detail}</p>
              <p className={styles.description}>{service.description}</p>
            </div>
          ))}
          <Link href="/services" className={styles.link}>Explore our services <ArrowUpRight size={16} /></Link>
        </div>

        <div className={styles.bottom}>
          <nav className={styles.navigation} aria-label="Explore our services">
            {SERVICES.map((service, index) => (
              <button key={service.title} type="button" onClick={() => goToStage(index)} aria-current={active === index ? 'step' : undefined}>
                <span>0{index + 1}</span><span>{service.title}</span>
              </button>
            ))}
          </nav>
          <p className={styles.scrollHint}><ArrowDown size={14} /> Scroll to explore</p>
        </div>
      </div>

      <div className={styles.staticStages}>
        {SERVICES.map((service, index) => (
          <figure key={service.title}>
            <VillaFrame index={index} />
            <figcaption><h3>0{index + 1} — {service.title}</h3><p>{service.description}</p></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
