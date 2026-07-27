import Image from 'next/image'

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Company at a Glance
            </p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Building trust through quality &amp; affordability
            </h2>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <Image
                src="/exterior-render.jpg"
                alt="Modern residential building exterior designed by GP Builders"
                width={1000}
                height={700}
                className="h-72 w-full object-cover sm:h-80"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-5 text-pretty text-base leading-relaxed text-muted-foreground">
              <p>
                Founded in 2021, GP Builders was established with a clear
                vision — to make high-quality construction and interior
                solutions accessible at an affordable price. Since our
                inception, we have delivered{' '}
                <span className="font-medium text-foreground">
                  9+ complete construction projects
                </span>{' '}
                and{' '}
                <span className="font-medium text-foreground">
                  20+ interior projects
                </span>
                , earning our clients&apos; confidence through exceptional
                workmanship, transparency, and timely execution.
              </p>
              <p>
                Whether it&apos;s building your dream home, a commercial space,
                or crafting elegant interiors, we offer end-to-end solutions
                tailored to your needs, lifestyle, and budget — combining
                structural strength, modern aesthetics, and long-lasting value.
              </p>
            </div>

            <figure className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <blockquote className="font-serif text-2xl font-medium leading-snug text-foreground sm:text-3xl">
                &ldquo;Quality at an affordable price — because excellence
                should be within everyone&apos;s reach.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-primary">
                — Our guiding philosophy
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
