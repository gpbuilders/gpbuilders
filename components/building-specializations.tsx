import { Building2, Home, Utensils, Briefcase, Leaf, Warehouse } from 'lucide-react'

const SPECIALIZATIONS = [
  {
    icon: Home,
    title: 'Residential Homes',
    description: 'Luxury villas, apartments, and bespoke residences designed for modern living with premium finishes and timeless aesthetics.',
  },
  {
    icon: Utensils,
    title: 'F&B & Hospitality',
    description: 'Restaurants, cafes, and hospitality spaces that blend ambiance with functionality for unforgettable guest experiences.',
  },
  {
    icon: Briefcase,
    title: 'Commercial Offices',
    description: 'Corporate workspaces, co-working hubs, and office interiors that inspire productivity and reflect brand identity.',
  },
  {
    icon: Building2,
    title: 'Retail & Showrooms',
    description: 'High-impact retail environments and brand showrooms designed to captivate customers and drive engagement.',
  },
  {
    icon: Leaf,
    title: 'Landscape Design',
    description: 'Outdoor spaces, gardens, and terraces that seamlessly extend your interiors with natural beauty and function.',
  },
  {
    icon: Warehouse,
    title: 'Industrial & Adaptive',
    description: 'Warehouse conversions, studio spaces, and adaptive reuse projects that celebrate character and practicality.',
  },
]

export function BuildingSpecializations() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Expertise
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            What We Build & Design
          </h2>
          <p className="text-lg text-muted-foreground">
            From intimate residences to commercial powerhouses, our portfolio spans diverse building types and spaces.
          </p>
        </div>

        {/* Specializations Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {SPECIALIZATIONS.map((spec) => {
            const Icon = spec.icon
            return (
              <div
                key={spec.title}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background-alt to-background border border-border p-8 transition-all duration-300 hover:border-accent hover:shadow-lg hover:from-accent/5 hover:to-accent/2"
              >
                {/* Background Accent */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors duration-300" />

                {/* Icon */}
                <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {spec.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {spec.description}
                  </p>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
