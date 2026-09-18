'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import styles from './building-specializations.module.css'

const SPECIALIZATIONS = [
  {
    image: '/spec-residential.png',
    title: 'Residential Homes',
    description: 'Luxury villas, apartments, and bespoke residences designed for modern living with premium finishes and timeless aesthetics.',
  },
  {
    image: '/spec-hospitality.png',
    title: 'F&B & Hospitality',
    description: 'Restaurants, cafes, and hospitality spaces that blend ambiance with functionality for unforgettable guest experiences.',
  },
  {
    image: '/spec-commercial.png',
    title: 'Commercial Offices',
    description: 'Corporate workspaces, co-working hubs, and office interiors that inspire productivity and reflect brand identity.',
  },
  {
    image: '/spec-retail.png',
    title: 'Retail & Showrooms',
    description: 'High-impact retail environments and brand showrooms designed to captivate customers and drive engagement.',
  },
  {
    image: '/spec-landscape.png',
    title: 'Landscape Design',
    description: 'Outdoor spaces, gardens, and terraces that seamlessly extend your interiors with natural beauty and function.',
  },
  {
    image: '/spec-industrial.png',
    title: 'Industrial & Adaptive',
    description: 'Warehouse conversions, studio spaces, and adaptive reuse projects that celebrate character and practicality.',
  },
]

export function BuildingSpecializations() {
  const [selection, setSelection] = useState({ active: 0, previous: 0, forward: true })
  const select = (index: number) => {
    setSelection(current => index === current.active ? current : {
      active: index,
      previous: current.active,
      forward: index > current.active,
    })
  }
  const active = SPECIALIZATIONS[selection.active]

  return (
    <section aria-labelledby="specializations-heading" className={styles.section}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Our expertise</p>
          <h2 id="specializations-heading">What We Build<br />&amp; Design</h2>
          <p className={styles.intro}>From intimate residences to ambitious commercial spaces, explore the places we bring to life.</p>
        </header>
        <div className={styles.layout}>
          <div>
            {SPECIALIZATIONS.map((spec, index) => {
              const isActive = selection.active === index
              return (
                <div key={spec.title} className={styles.category} data-active={isActive}>
                  <h3>
                    <button type="button" id={`specialization-button-${index}`} aria-expanded={isActive} aria-controls={`specialization-description-${index}`} onClick={() => select(index)}>
                      {spec.title}
                      {isActive ? <Minus aria-hidden="true" size={22} /> : <Plus aria-hidden="true" size={22} />}
                    </button>
                  </h3>
                  <div id={`specialization-description-${index}`} role="region" aria-labelledby={`specialization-button-${index}`} hidden={!isActive}>
                    <p className={styles.description}>{spec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <figure className={styles.figure}>
            <div className={styles.photoStage}>
              <Image src={SPECIALIZATIONS[selection.previous].image} alt="" aria-hidden="true" fill sizes="(max-width: 767px) 100vw, 50vw" className={styles.photo} />
              <div key={selection.active} className={styles.reveal} data-forward={selection.forward}>
                <Image src={active.image} alt={active.title} fill sizes="(max-width: 767px) 100vw, 50vw" className={styles.photo} />
              </div>
            </div>
            <figcaption aria-live="polite">
              <span>{active.title}</span>
              <span className={styles.count}>{String(selection.active + 1).padStart(2, '0')} / 06</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
