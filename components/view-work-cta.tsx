import Image from 'next/image'
import Link from 'next/link'

const PREVIEW = [
  {
    src: '/interior-hallway.jpg',
    alt: 'Courtyard Residence interior by GP Builders',
    offset: false,
  },
  {
    src: '/exterior-render.jpg',
    alt: 'Contemporary Villa exterior by GP Builders',
    offset: true,
  },
]

export function ViewWorkCta() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-3.5 text-xs uppercase tracking-[0.28em] text-secondary">
              Our work
            </p>
            <h2 className="mb-5 font-serif text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-[38px]">
              See what we&apos;ve built.
            </h2>
            <p className="mb-9 max-w-[46ch] text-[17px] font-light leading-[1.65] text-muted-foreground">
              Residences, apartments, and commercial spaces delivered across
              Tamil Nadu — from full construction to complete home interiors.
            </p>
            <Link
              href="/projects"
              className="inline-block bg-primary px-10 py-4 text-[13px] uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary-dark hover:text-white"
            >
              View our work →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {PREVIEW.map((image) => (
              <Link
                key={image.src}
                href="/projects"
                className={`group relative aspect-[3/4] overflow-hidden rounded-2xl ${
                  image.offset ? 'lg:mt-12' : ''
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
