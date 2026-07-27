import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function CtaBand() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
          />
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
            Ready when you are
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Let&apos;s bring your space to life
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            From first sketch to final handover, GP Builders delivers quality
            craftsmanship at an affordable price. Tell us about your project.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: 'secondary' }),
                'h-12 gap-2 px-7 text-base',
              )}
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-12 border-primary-foreground/40 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              )}
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
