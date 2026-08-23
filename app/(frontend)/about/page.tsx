'use client'

import type { Metadata } from 'next'
import { AboutHero } from '@/components/about-hero'
import { About } from '@/components/about'
import { Values } from '@/components/values'
import { ViewWorkCta } from '@/components/view-work-cta'
import { Timeline } from '@/components/timeline'
import { ConsultationCta } from '@/components/consultation-cta'
import { ParallaxSection } from '@/components/parallax-section'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <About />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.6}
        className=""
      >
        <Values />
      </ParallaxSection>
      <ViewWorkCta />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.4}
        className=""
      >
        <Timeline />
      </ParallaxSection>
      <ConsultationCta variant="about" />
    </>
  )
}
