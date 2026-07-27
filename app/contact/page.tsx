import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { Contact } from '@/components/contact'

export const metadata: Metadata = {
  title: 'Contact | GP Builders',
  description:
    'Get in touch with GP Builders. Tell us about your space and vision, and our team will respond with a tailored plan and transparent estimate.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Let's start your project"
        description="Tell us about your space and vision. Our team will get back to you with a tailored plan and a transparent estimate."
        currentLabel="Contact"
      />
      <Contact />
    </>
  )
}
