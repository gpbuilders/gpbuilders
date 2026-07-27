'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SERVICE_OPTIONS = [
  'Architecture + Interior + Execution',
  'Interior Design + Execution',
  'Execution Only',
  'Not sure yet',
]

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="scroll-mt-20 bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="bg-primary p-8 text-primary-foreground sm:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
                Start a Project
              </p>
              <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight">
                Let&apos;s build something exceptional
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
                Tell us about your space and vision. Our team will get back to
                you with a tailored plan and transparent estimate.
              </p>

              <ul className="mt-10 space-y-5">
                <li className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-primary-foreground/60">
                      Call us
                    </span>
                    <span className="text-sm font-medium">+91 98765 43210</span>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-primary-foreground/60">
                      Email us
                    </span>
                    <span className="text-sm font-medium">
                      hello@gpbuilders.in
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-primary-foreground/60">
                      Visit us
                    </span>
                    <span className="text-sm font-medium">
                      Chennai, Tamil Nadu
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-8 sm:p-12">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-14 w-14 text-primary" />
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">
                    Thank you!
                  </h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    Your enquiry has been received. Our team will reach out to
                    you shortly to discuss your project.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" htmlFor="name">
                      <input
                        id="name"
                        name="name"
                        required
                        className="form-input"
                        placeholder="Your name"
                      />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="form-input"
                        placeholder="+91 ..."
                      />
                    </Field>
                  </div>
                  <Field label="Email" htmlFor="email">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="form-input"
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Service interested in" htmlFor="service">
                    <select id="service" name="service" className="form-input">
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tell us about your project" htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="form-input resize-none"
                      placeholder="Location, size, timeline, and vision..."
                    />
                  </Field>
                  <Button type="submit" className="h-12 w-full text-base">
                    Send Enquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}
