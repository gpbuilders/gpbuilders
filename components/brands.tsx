import { BrandMarquee } from './brand-marquee'

export function Brands() {
  return (
    <section id="partners" className="scroll-mt-20 py-20 lg:py-24">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Outside the container on purpose — see BrandMarquee. */}
      <BrandMarquee className="mt-12" />
    </section>
  )
}
