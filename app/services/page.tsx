import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { Services } from '@/components/services'
import { Process } from '@/components/process'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'Services | GP Builders',
  description:
    'Explore GP Builders services — full architecture, interior design, and execution, or individual stages. See our proven programme strategy from concept to handover.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Services tailored to your project"
        description="Whether you need the complete journey or a single stage, our team adapts to where your project stands today — with transparent pricing and a clear process."
        currentLabel="Services"
      />
      <Services />
      <Process />
      <CtaBand />
    </>
  )
}
