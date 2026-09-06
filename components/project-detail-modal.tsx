'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mediaUrl } from '@/lib/media'
import type { Project } from '@/payload-types'

interface ProjectDetailModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Lock the page behind the modal. Compensating for the scrollbar keeps the
  // fixed header from jumping on platforms that reserve gutter space for it.
  useEffect(() => {
    if (!isOpen) return

    const { body, documentElement: html } = document
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    }

    // The scrolling element here is <html>, and body's overflow only reaches
    // the viewport by propagation — which does not apply once html has its own
    // value. Setting both is unambiguous.
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      html.style.overflow = previous.htmlOverflow
      body.style.overflow = previous.bodyOverflow
      body.style.paddingRight = previous.bodyPaddingRight
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  // Card image first, then any extra gallery images.
  const images = [
    mediaUrl(project.image),
    ...(project.gallery ?? []).map((item) => mediaUrl(item)),
  ]
  const currentImage = images[currentImageIndex] ?? images[0]

  const goNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const goPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Swipe handling. The panel below scrolls vertically, so a gesture only
  // counts as a swipe when it is clearly horizontal — otherwise scrolling the
  // details would keep changing the photo underneath.
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start || images.length < 2) return

    const t = event.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y

    // 40px filters out taps and stray movement; the dy check keeps a vertical
    // scroll from registering as a swipe.
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return

    if (dx < 0) {
      goNext()
    } else {
      goPrev()
    }
  }

  // Rendered into document.body: ParallaxSection wraps page content in a
  // `relative z-10` element, which creates a stacking context that would trap
  // the modal underneath the fixed z-50 header.
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
      >
        {/* flex-col so the scrolling area below can be given a bounded height.
            max-h alone leaves the child's h-full resolving against nothing. */}
        <div className="relative flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-all hover:shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>

          {/* min-h-0 matters: a flex child defaults to min-height:auto, which
              refuses to shrink below its content and so never scrolls. */}
          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-6">
            {/* Image Section */}
            <div className="lg:col-span-4 relative bg-background-alt flex items-center justify-center group">
              {/* Was h-screen, which is taller than the modal's own 90vh cap —
                  the image alone overflowed it. Sized to leave room for the
                  details below on mobile, and to fill the row on desktop. */}
              <div
                className="relative w-full h-[45vh] lg:h-[80vh]"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={currentImage}
                  alt={project.title}
                  fill
                  // contain, not cover: show the whole photograph rather than
                  // cropping it to the container's shape.
                  className="object-contain"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  priority
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    {/* Visible by default, hover-revealed only from lg up:
                        opacity-0 + group-hover left these permanently invisible
                        on touch, where there is no hover state to trigger. */}
                    <button
                      onClick={goPrev}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-foreground transition-all lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goNext}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-foreground transition-all lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 text-white text-sm font-medium">
                      {currentImageIndex + 1} / {images.length}
                    </div>

                    {/* Image Dots */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          aria-label={`Go to image ${idx + 1}`}
                          aria-current={idx === currentImageIndex}
                          className={cn(
                            'h-2 rounded-full transition-all',
                            idx === currentImageIndex
                              ? 'bg-white w-8'
                              : 'bg-white/40 w-2 hover:bg-white/60',
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2 p-8 flex flex-col justify-between bg-white">
              {/* Header */}
              <div>
                {/* Project Title */}
                <h2 className="font-serif text-4xl font-semibold text-foreground mb-2">
                  {project.title}
                </h2>

                {/* Category Tag */}
                <div className="inline-block mb-6">
                  <span className="px-4 py-1.5 bg-accent/10 text-accent font-semibold text-xs uppercase tracking-widest rounded-full">
                    {project.category}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground mb-6 pb-6 border-b border-border">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{project.location}</span>
                </div>

                {/* Scope */}
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">
                    Project Scope
                  </h3>
                  <p className="text-lg text-foreground font-medium">{project.scope}</p>
                </div>

                {/* Description */}
                {project.description && (
                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
                      About This Project
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer CTA. Was a bare <button> with no handler, so it did
                  nothing at all. Carries the project through so the enquiry
                  arrives with context instead of the visitor retyping it. */}
              <div className="pt-6 border-t border-border">
                <Link
                  href={{
                    pathname: '/contact',
                    query: { project: project.title, type: project.category },
                  }}
                  onClick={onClose}
                  className="block w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-semibold text-center hover:bg-primary-dark transition-colors"
                >
                  Discuss Similar Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
