'use client'

import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { BuildingSpecializations } from '@/components/building-specializations'
import { Process } from '@/components/process'
import { ConsultationCta } from '@/components/consultation-cta'
import { ParallaxSection } from '@/components/parallax-section'

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Services tailored to your project"
        description="Whether you need the complete journey or a single stage, our team adapts to where your project stands today — with transparent pricing and a clear process."
      />
      <ParallaxSection
        backgroundColor="bg-background"
        speed={0.4}
        className=""
      >
        <BuildingSpecializations />
      </ParallaxSection>
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.5}
        className=""
      >
        <Process />
      </ParallaxSection>
      <ConsultationCta variant="services" />
    </>
  )
}
