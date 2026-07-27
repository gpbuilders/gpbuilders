import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 py-12 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Architecture · Interiors · Execution
            </span>

            <h1 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Crafted spaces,{' '}
              <span className="text-primary">built to last.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              GP Builders designs and delivers luxury homes, commercial spaces,
              and interiors — with premium materials, skilled craftsmanship, and
              transparent pricing. Quality at an affordable price.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className={cn(buttonVariants(), 'h-12 gap-2 px-7 text-base')}
              >
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#projects"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-12 px-7 text-base',
                )}
              >
                View Our Work
              </a>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { value: '9+', label: 'Construction Projects' },
                { value: '20+', label: 'Interior Projects' },
                { value: '100%', label: 'Quality Commitment' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                <Image
                  src="/interior-hallway.jpg"
                  alt="Modern interior hallway with terracotta flooring, exposed brick, and a landscaped courtyard by GP Builders"
                  width={1200}
                  height={800}
                  priority
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden max-w-[220px] rounded-xl border border-border bg-card p-5 shadow-lg sm:block">
                <p className="font-serif text-xl font-semibold text-primary">
                  Since 2021
                </p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                  Building trust through quality &amp; affordability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
