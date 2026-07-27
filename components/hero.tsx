import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Hero() {
  const projectImages = [
    {
      src: '/interior-hallway.jpg',
      alt: 'Modern interior hallway with terracotta and plants',
    },
    {
      src: '/project-living-room.png',
      alt: 'Luxury living room with teal accent wall',
    },
    {
      src: '/project-kitchen.png',
      alt: 'Modern modular kitchen with natural light',
    },
  ]

  return (
    <section id="top" className="relative overflow-hidden bg-dark-bg text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Crafted spaces,{' '}
              <span className="text-accent">built to last.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/80">
              GP Builders designs and delivers luxury homes, commercial spaces,
              and interiors — with premium materials, skilled craftsmanship, and
              transparent pricing.
            </p>

            <Link
              href="/contact"
              className={cn(
                buttonVariants(),
                'mt-8 h-12 px-8 text-base bg-primary-dark hover:bg-primary'
              )}
            >
              Explore Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Stats */}
            <div className="mt-12 flex gap-8 border-t border-white/10 pt-8">
              {[
                { value: '9+', label: 'Projects' },
                { value: '20+', label: 'Designs' },
                { value: '100%', label: 'Quality' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-3xl font-semibold sm:text-4xl text-accent">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-white/60">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Large image - top left spans 2 rows */}
            <div className="row-span-2">
              <div className="relative overflow-hidden rounded-xl h-full">
                <Image
                  src={projectImages[0].src}
                  alt={projectImages[0].alt}
                  width={400}
                  height={500}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Top right small image */}
            <div>
              <div className="relative overflow-hidden rounded-xl h-full">
                <Image
                  src={projectImages[1].src}
                  alt={projectImages[1].alt}
                  width={300}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Bottom right small image */}
            <div>
              <div className="relative overflow-hidden rounded-xl h-full">
                <Image
                  src={projectImages[2].src}
                  alt={projectImages[2].alt}
                  width={300}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
