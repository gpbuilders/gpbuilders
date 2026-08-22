import Link from 'next/link'

type CtaVariant = 'home' | 'about' | 'projects' | 'services'

const LIGHT_BUTTON =
  'inline-block bg-primary px-11 py-[18px] text-[13px] uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary-dark hover:text-white'

export function ConsultationCta({
  variant = 'home',
}: {
  variant?: CtaVariant
}) {
  if (variant === 'projects') {
    return (
      <section className="bg-dark-bg py-20 text-center lg:py-[88px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-[18px] font-serif text-3xl font-normal text-muted sm:text-4xl lg:text-[38px]">
            Your project could be next.
          </h2>
          <p className="mb-9 text-base font-light text-muted/70">
            Browse the work above, then start a conversation with our team.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent px-10 py-4 text-[13px] uppercase tracking-[0.14em] text-accent-foreground transition-colors hover:bg-[#a8d2d8]"
          >
            Book a free consultation
          </Link>
        </div>
      </section>
    )
  }

  if (variant === 'services') {
    return (
      <section className="py-20 text-center lg:py-[110px]">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-[22px] text-balance font-serif text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-[46px]">
            Tell us where your project stands.
          </h2>
          <p className="mb-10 text-[17px] font-light leading-[1.65] text-muted-foreground">
            A bare plot, a finished set of drawings, or a home ready for its
            next chapter — we&apos;ll advise on the right scope, a realistic
            timeline, and an honest estimate. No obligation.
          </p>
          <Link href="/contact" className={LIGHT_BUTTON}>
            Book a free consultation
          </Link>
        </div>
      </section>
    )
  }

  if (variant === 'about') {
    return (
      <section className="py-20 text-center lg:py-[110px]">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8">
          <p className="mb-9 font-serif text-xl leading-[1.6] tracking-[0.03em] text-primary sm:text-2xl">
            Plan strategically. Execute precisely.
            <br />
            Review consistently. Deliver excellence.
          </p>
          <Link href="/contact" className={LIGHT_BUTTON}>
            Book a free consultation
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 text-center lg:py-[110px]">
      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        <h2 className="mb-[22px] text-balance font-serif text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-[46px]">
          Let&apos;s talk about the home you have in mind.
        </h2>
        <p className="mb-10 text-[17px] font-light leading-[1.65] text-muted-foreground">
          A free, no-obligation consultation with our team — bring your plot,
          your plans, or just an idea.
        </p>
        <Link href="/contact" className={LIGHT_BUTTON}>
          Book a free consultation
        </Link>
      </div>
    </section>
  )
}
