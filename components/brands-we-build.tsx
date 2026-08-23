import Image from 'next/image'
import { getBrandLogo } from '@/lib/brand-logos'

const BRANDS = [
  'Kohler',
  'Hafele',
  'Godrej',
  'Dulux',
  'Saint Gobain',
  'Bosch',
  'Schüco',
  'Somany',
]

export function BrandsWeBuild() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Brands We Build With
          </h2>
          <p className="mt-3 text-muted-foreground">
            Premium materials from world-class partners
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {BRANDS.map((brand) => {
            const logo = getBrandLogo(brand)
            return (
              <div
                key={brand}
                className="group flex h-24 items-center justify-center rounded-lg border border-border bg-card px-4 transition-all hover:border-primary/50 hover:shadow-md"
              >
                {logo ? (
                  <Image
                    src={logo.src}
                    alt={`${brand} logo`}
                    width={logo.width}
                    height={logo.height}
                    className="max-h-8 w-auto max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="text-center text-sm font-semibold text-foreground">
                    {brand}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
