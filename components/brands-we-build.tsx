import Image from 'next/image'
import { BRANDS, getBrandLogo } from '@/lib/brand-logos'


export function BrandsWeBuild() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Brands We Build With
          </h2>
          <p className="mt-3 text-muted-foreground">
            Premium materials from world-class partners
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {BRANDS.map((brand) => {
            const logo = getBrandLogo(brand)
            return (
              <div
                key={brand}
                className="flex h-24 w-[calc(50%-12px)] items-center justify-center rounded-lg border border-border bg-card px-6 transition-all hover:border-primary/50 hover:shadow-md sm:w-56"
              >
                {logo ? (
                  <Image
                    src={logo.src}
                    alt={`${brand} logo`}
                    width={logo.width}
                    height={logo.height}
                    className="max-h-8 w-auto max-w-[110px] object-contain"
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
