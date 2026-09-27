import { BrandMarquee } from './brand-marquee'

export function BrandsWeBuild() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Brands We Build With
          </h2>
          <p className="mt-3 text-muted-foreground">
            Premium materials from world-class partners
          </p>
        </div>
      </div>

      {/* Outside the container on purpose — see BrandMarquee. */}
      <BrandMarquee />
    </section>
  )
}
