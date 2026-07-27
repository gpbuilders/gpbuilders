import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { About } from '@/components/about'
import { Values } from '@/components/values'
import { Timeline } from '@/components/timeline'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'About | GP Builders',
  description:
    'Learn about GP Builders — our mission, values, and the milestones that shaped our journey delivering quality architecture, interiors, and execution.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="Design and build, under one roof"
        description="GP Builders is a design-and-build studio delivering architecture, interiors, and execution for residential and commercial spaces — with quality craftsmanship at an affordable price."
        currentLabel="About"
      />
      <About />
      <Values />
      <Timeline />
      <CtaBand />
    </>
  )
}
