'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AboutHero() {
  return (
    <>
      {/* Main Hero Section */}
      <section className="relative w-full overflow-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Architectural Sketch */}
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src="/architecture-sketch.png"
                alt="Architectural building sketch"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center max-w-2xl">
              {/* Eyebrow */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-3">
                <span className="inline-flex gap-1">
                  <span className="w-0.5 h-0.5 bg-primary rounded-full" />
                  <span className="w-0.5 h-0.5 bg-primary rounded-full" />
                  <span className="w-0.5 h-0.5 bg-primary rounded-full" />
                </span>
                Design & Build Excellence
              </p>

              {/* Main Heading */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight text-foreground mb-6">
                GP Builders
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                We merge innovation with timeless design to create spaces that inspire and endure. Our architecture balances aesthetics, functionality, and sustainability for a better future.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants(),
                    'h-12 px-8 text-base font-semibold gap-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg transition-all',
                  )}
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="h-12 px-8 text-base font-semibold rounded-lg border-2 border-primary text-primary hover:bg-primary/5 transition-all">
                  Learn More
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex items-start gap-4 pb-12 border-b border-border">
                <div className="text-2xl">💼</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ready to Build?</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your vision and let's create something extraordinary together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background-alt py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '15+',
                label: 'Years Experience',
                description: 'Delivering excellence since day one',
              },
              {
                number: '4.9/5',
                label: 'Client Rating',
                description: 'Trusted by hundreds of satisfied clients',
              },
              {
                number: '500+',
                label: 'Projects Completed',
                description: 'From concept to handover, perfectly executed',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  /{String(stat.number).padStart(2, '0')}
                </p>
                <p className="text-5xl sm:text-6xl font-semibold text-foreground mb-3 font-serif">
                  {stat.number}
                </p>
                <h3 className="font-semibold text-foreground mb-2">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
