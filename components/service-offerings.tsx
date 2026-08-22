import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const SERVICE_TIERS = [
  {
    title: 'Full Service',
    subtitle: 'Architecture + Interior + Construction',
    description:
      'Complete end-to-end delivery from concept to handover. Our integrated team manages design, space planning, premium interiors, and on-site execution under one roof.',
    features: [
      'In-house architecture team',
      'Comprehensive space planning',
      'Bespoke interior design',
      'Quality execution oversight',
      'Single point of accountability',
      'Transparent pricing & timeline',
    ],
    highlighted: true,
    cta: 'Learn More',
  },
  {
    title: 'Interior Focus',
    subtitle: 'Interior Design + Construction',
    description:
      'Transform your existing space with our curated interiors and precise execution. Perfect for renovations and upgrades.',
    features: [
      'Tailored interior concepts',
      'Premium material selection',
      'Modern modular kitchens',
      'Spatial optimization',
      'Turnkey installation',
      'Warranty & after-care',
    ],
    highlighted: false,
    cta: 'Explore',
  },
  {
    title: 'Build Only',
    subtitle: 'Construction Excellence',
    description:
      'Have designs ready? Let our experienced engineering and site teams deliver disciplined, quality-driven execution on schedule.',
    features: [
      'Skilled site management',
      'Quality compliance protocols',
      'Safety oversight',
      'Material procurement',
      'Budget management',
      'On-time delivery',
    ],
    highlighted: false,
    cta: 'Get Started',
  },
]

export function ServiceOfferings() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Service Offerings
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Tailored Services for Every Vision
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the level of involvement that fits your project. From full design-and-build to execution-only, we adapt to your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 mt-16">
          {SERVICE_TIERS.map((tier, idx) => (
            <div
              key={tier.title}
              className={cn(
                'relative rounded-3xl transition-all duration-300 hover:shadow-xl',
                tier.highlighted
                  ? 'border-2 border-primary bg-primary/5 p-8 md:scale-105'
                  : 'border border-border bg-card p-8 hover:border-primary/50',
              )}
            >
              {/* Badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                  {tier.title}
                </h3>
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
                  {tier.subtitle}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8 pb-8 border-b border-border">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className={cn(
                  buttonVariants(),
                  'w-full gap-2',
                  tier.highlighted
                    ? 'bg-primary hover:bg-primary-dark text-primary-foreground'
                    : 'bg-background-alt hover:bg-primary/10 text-foreground border border-border hover:border-primary',
                )}
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
