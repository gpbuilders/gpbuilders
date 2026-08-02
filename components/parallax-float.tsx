'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxFloatProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export function ParallaxFloat({
  children,
  intensity = 0.3,
  className,
}: ParallaxFloatProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Calculate position relative to viewport center
      const x = (clientX - innerWidth / 2) * intensity
      const y = (clientY - innerHeight / 2) * intensity

      element.style.transform = `translate(${x}px, ${y}px)`
    }

    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const y = scrolled * intensity * 0.5
      
      if (ref.current) {
        ref.current.style.transform = `translateY(${y}px)`
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [intensity])

  return (
    <div
      ref={ref}
      className={cn('transition-transform duration-100', className)}
    >
      {children}
    </div>
  )
}
