import Image from 'next/image'
import { getBrandLogo } from '@/lib/brand-logos'

const BRANDS = [
  'Asian Paints',
  'Jaquar',
  'Kohler',
  'Hettich',
  'Century Ply',
  'Saint-Gobain',
  'Ultratech',
  'Hindware',
  'Greenlam',
  'Philips',
]

export function Brands() {
  return (
    <section id="partners" className="scroll-mt-20 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Brands We Use
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Trusted materials from trusted names
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            We partner with leading manufacturers so every finish meets our
            standard of premium quality and lasting value.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {BRANDS.map((brand) => {
            const logo = getBrandLogo(brand)
            return (
              <div
                key={brand}
                className="group flex items-center justify-center bg-card px-6 py-8 text-center transition-colors hover:bg-background-alt"
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
                  <span className="font-serif text-lg font-medium text-foreground/70 transition-colors group-hover:text-foreground">
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
