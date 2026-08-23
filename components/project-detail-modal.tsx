'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
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
    ...(project.gallery ?? []).map((item) => mediaUrl(item.image)),
  ]
  const currentImage = images[currentImageIndex] ?? images[0]

  const goNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const goPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
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
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-all hover:shadow-lg"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-6 h-full overflow-y-auto">
            {/* Image Section */}
            <div className="lg:col-span-4 relative bg-background-alt min-h-96 lg:min-h-screen flex items-center justify-center group">
              <div className="relative w-full h-96 lg:h-screen">
                <Image
                  src={currentImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-foreground transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-foreground transition-all opacity-0 group-hover:opacity-100"
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

              {/* Footer CTA */}
              <div className="pt-6 border-t border-border">
                <button className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-colors">
                  Discuss Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
