'use client'

import { useEffect, useRef, useState } from 'react'
import { Star, Quote, Pause, Play } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'From architecture to interiors, everything was handled under one roof. Weekly reviews kept us informed and the project finished right on schedule.',
    name: 'Karthik Subramanian',
    role: 'Apartment Interior Client',
    initials: 'KS',
  },
  {
    quote:
      'They delivered a premium restaurant fit-out within our budget. Craftsmanship and communication were exceptional from day one.',
    name: 'Anjali Menon',
    role: 'Commercial Client',
    initials: 'AM',
  },
  {
    quote:
      'I had a great experience with this construction company. The quality of work is excellent, and the team is professional, reliable, and committed to delivering on time. The engineer is very respectful, approachable, and treats everyone with kindness. Their friendly attitude and willingness to listen make the entire experience smooth and stress-free. I highly recommend this company to anyone looking for trustworthy and high-quality construction services.',
    name: 'Harihara Sudhan',
    role: 'Construction Client',
    initials: 'HS',
  },
]

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const interaction = useRef({ hover: false, touch: false, focus: false, resumeAt: 0 })
  const [paused, setPaused] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    const syncSize = () => setCanScroll(scroller.scrollWidth > scroller.clientWidth + 2)
    syncMotion()
    syncSize()
    media.addEventListener('change', syncMotion)
    const resize = new ResizeObserver(syncSize)
    resize.observe(scroller)
    const release = () => {
      interaction.current.touch = false
      interaction.current.resumeAt = performance.now() + 1800
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      media.removeEventListener('change', syncMotion)
      resize.disconnect()
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || !canScroll || paused || reducedMotion) return
    let frame = 0
    let previous = 0
    let position = scroller.scrollLeft
    let direction = 1
    let visible = false
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(scroller)
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0
      previous = now
      const state = interaction.current
      if (!visible || document.hidden || state.hover || state.touch || state.focus || now < state.resumeAt) {
        position = scroller.scrollLeft
      } else {
        const end = scroller.scrollWidth - scroller.clientWidth
        position = Math.max(0, Math.min(end, position + direction * elapsed * 0.018))
        scroller.scrollLeft = position
        if (position >= end || position <= 0) {
          direction *= -1
          state.resumeAt = now + 1800
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [canScroll, paused, reducedMotion])

  return (
    <section id="reviews" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Customer Feedback
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-muted sm:text-5xl">
            Trusted by families &amp; businesses
          </h2>
        </div>

        {canScroll && !reducedMotion && (
          <div className="mt-6 flex justify-center">
            <button type="button" onClick={() => setPaused(value => !value)}
              aria-label={paused ? 'Resume review scrolling' : 'Pause review scrolling'}
              aria-pressed={paused}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-muted/30 px-4 text-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              {paused ? <Play size={14} /> : <Pause size={14} />}
              {paused ? 'Resume scrolling' : 'Pause scrolling'}
            </button>
          </div>
        )}
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Customer reviews"
          tabIndex={canScroll ? 0 : undefined}
          onPointerEnter={event => { if (event.pointerType === 'mouse') interaction.current.hover = true }}
          onPointerLeave={() => { interaction.current.hover = false }}
          onPointerDown={() => { interaction.current.touch = true; interaction.current.focus = false }}
          onFocus={event => { interaction.current.focus = event.currentTarget.matches(':focus-visible') }}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) interaction.current.focus = false }}
          onWheel={() => { interaction.current.resumeAt = performance.now() + 3000 }}
          className={[
            'mt-10 flex gap-8 overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
            TESTIMONIALS.length <= 3 ? 'lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0' : '',
          ].join(' ')}
        >
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              /* 82% leaves the next card peeking, which is what signals the
                 row can be swiped. */
              className={`flex w-[82%] shrink-0 flex-col border-t border-muted/20 pt-7 sm:w-[60%] ${TESTIMONIALS.length <= 3 ? 'lg:w-auto' : 'lg:w-[calc((100%-4rem)/3)]'}`}
            >
              <Quote className="h-8 w-8 text-accent/30" />
              <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-base leading-relaxed text-muted/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-muted/10 pt-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-serif text-sm font-semibold text-accent">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-muted">
                    {t.name}
                  </span>
                  <span className="block text-xs text-muted/60">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
