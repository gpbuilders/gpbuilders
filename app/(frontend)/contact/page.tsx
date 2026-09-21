import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { MinimalHero } from '@/components/minimal-hero'
import { Suspense } from 'react'
import { ContactForm } from '@/components/contact-form'
export const metadata: Metadata = {
  title: 'Contact | GP Builders',
  description: 'Tell GP Builders about your architecture, construction, or interior design project.',
}

export default function ContactPage() {
  return (
    <>
      <MinimalHero
        title="Let's Start"
        subtitle="Your Project"
        description="Tell us about your space and vision. Our team will get back to you with a tailored plan and a transparent estimate."
      />

      <section className="bg-background-alt py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Info Column */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground text-sm mb-8">
                    Reach out to us through any of these channels. We&apos;re here to help bring your vision to life.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                        <Mail className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        Email
                      </p>
                      <a href="mailto:hello@gpbuilders.in" className="inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                        hello@gpbuilders.in
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                        <Phone className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        Phone
                      </p>
                      <a href="tel:+919363699574" className="inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                        +91 93636 99574
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                        <MapPin className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        Office
                      </p>
                      <address className="mt-1 text-sm not-italic leading-relaxed text-muted-foreground">
                        GP Builders
                        <br />
                        17/4, G-3, Pushpak Nagar
                        <br />
                        Srirangam, Trichy &ndash; 620006
                        <br />
                        Tamil Nadu, India
                      </address>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="rounded-2xl border border-border bg-card p-6 mt-8">
                  <h3 className="font-semibold text-foreground text-sm mb-4">
                    Office Hours
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-10">
                <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                  Send us a message
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
                {/* ContactForm reads ?project= to prefill an enquiry from the
                    project modal, and useSearchParams needs a boundary or the
                    whole page is forced out of static rendering. */}
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
