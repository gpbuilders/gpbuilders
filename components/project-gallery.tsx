'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import styles from './project-gallery.module.css'

type GalleryImage = { src: string; alt: string; ratio: number }

export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (media.matches) return
        const animation = entry.target.animate(
          [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' },
        )
        animations.add(animation)
        animation.onfinish = () => animations.delete(animation)
      })
    }, { threshold: 0.08 })
    root.current?.querySelectorAll('figure').forEach(figure => observer.observe(figure))
    const stop = () => { if (media.matches) animations.forEach(animation => animation.cancel()) }
    media.addEventListener('change', stop)
    return () => {
      observer.disconnect()
      animations.forEach(animation => animation.cancel())
      media.removeEventListener('change', stop)
    }
  }, [])

  return (
    <section aria-label={`${title} photographs`} className="mx-auto max-w-site px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-5">
        <h2 className="font-serif text-3xl text-foreground sm:text-4xl">A closer look</h2>
        <span className="text-xs uppercase tracking-[0.14em] text-primary">{images.length} images</span>
      </div>
      <div ref={root} className={styles.gallery}>
        {Array.from({ length: Math.ceil(images.length / 3) }, (_, groupIndex) => {
          const group = images.slice(groupIndex * 3, groupIndex * 3 + 3)
          return (
            <div key={groupIndex} className={styles.group} data-count={group.length}>
              {group.map((image, index) => (
                <figure key={`${image.src}-${index}`} className={styles.tile}>
                  <div className={styles.image} style={{ '--photo-ratio': image.ratio } as CSSProperties}>
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1536px) 60vw, 880px" className="object-cover" />
                  </div>
                </figure>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
