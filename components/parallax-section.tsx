'use client'

import { useParallax } from '@/hooks/use-parallax'
import { cn } from '@/lib/utils'

interface ParallaxSectionProps {
  backgroundImage?: string
  backgroundColor?: string
  speed?: number
  children: React.ReactNode
  className?: string
}

export function ParallaxSection({
  backgroundImage,
  backgroundColor = 'bg-background',
  speed = 0.5,
  children,
  className,
}: ParallaxSectionProps) {
  const ref = useParallax(speed)

  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden',
        backgroundColor,
        className,
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }
          : undefined
      }
    >
      {/* Overlay for readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
