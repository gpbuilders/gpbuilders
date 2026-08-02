import { useEffect, useRef } from 'react'

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      if (!element) return
      
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      
      // Only apply parallax when element is in viewport
      if (elementTop < windowHeight && elementTop > -element.offsetHeight) {
        const scrolled = window.pageYOffset
        const elementOffset = element.offsetTop
        const yPos = (elementOffset - scrolled) * speed
        element.style.backgroundPosition = `center ${yPos}px`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return ref
}
