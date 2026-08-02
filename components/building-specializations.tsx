import Image from 'next/image'

const SPECIALIZATIONS = [
  {
    image: '/spec-residential.png',
    title: 'Residential Homes',
    description: 'Luxury villas, apartments, and bespoke residences designed for modern living with premium finishes and timeless aesthetics.',
  },
  {
    image: '/spec-hospitality.png',
    title: 'F&B & Hospitality',
    description: 'Restaurants, cafes, and hospitality spaces that blend ambiance with functionality for unforgettable guest experiences.',
  },
  {
    image: '/spec-commercial.png',
    title: 'Commercial Offices',
    description: 'Corporate workspaces, co-working hubs, and office interiors that inspire productivity and reflect brand identity.',
  },
  {
    image: '/spec-retail.png',
    title: 'Retail & Showrooms',
    description: 'High-impact retail environments and brand showrooms designed to captivate customers and drive engagement.',
  },
  {
    image: '/spec-landscape.png',
    title: 'Landscape Design',
    description: 'Outdoor spaces, gardens, and terraces that seamlessly extend your interiors with natural beauty and function.',
  },
  {
    image: '/spec-industrial.png',
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {SPECIALIZATIONS.map((spec) => (
            <div
              key={spec.title}
              className="group relative overflow-hidden rounded-3xl h-80 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <Image
                src={spec.image}
                alt={spec.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="font-serif text-2xl font-semibold text-white mb-2">
                  {spec.title}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed mb-0 group-hover:text-white transition-colors duration-300 line-clamp-2 group-hover:line-clamp-3">
                  {spec.description}
                </p>

                {/* Bottom Accent Line */}
                <div className="mt-4 h-1 w-0 bg-accent transition-all duration-300 group-hover:w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
