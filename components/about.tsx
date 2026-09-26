import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
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
                src="/about-residence.webp"
                alt="A GP Builders residence at dusk, its terracotta facade and landscaped frontage lit from below"
                width={1280}
                height={720}
                // Five of twelve columns at lg, full width below — without
                // this the browser assumes 100vw and fetches a source far
                // larger than the slot.
                sizes="(max-width: 1024px) 100vw, 640px"
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

            {/* The section names the company but nobody in it. A face and a
                name are what turn "founded in 2021" into someone accountable
                for the work. */}
            <div className="mt-8 flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-card p-6">
              <Image
                src="/vignesh-chandrasekaran.webp"
                alt="Vignesh Chandrasekaran, founder of GP Builders"
                width={640}
                height={640}
                // Rendered at 80px, 96px from sm up — ask for no more than the
                // largest of those at 2x.
                sizes="96px"
                className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
              />
              <div className="min-w-0">
                <p className="font-serif text-lg font-semibold text-foreground">
                  Vignesh Chandrasekaran
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Founder, GP Builders
                </p>
                <a
                  href="https://www.linkedin.com/in/vignesh-chandrasekaran-8b432843a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                >
                  Connect on LinkedIn
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
