'use client'

import type { Metadata } from 'next'
import { AboutHero } from '@/components/about-hero'
import { About } from '@/components/about'
import { Values } from '@/components/values'
import { Timeline } from '@/components/timeline'
import { CtaBand } from '@/components/cta-band'
import { ParallaxSection } from '@/components/parallax-section'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <About />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.6}
        className="py-20 lg:py-28"
      >
        <Values />
      </ParallaxSection>
      <ParallaxSection
        backgroundColor="bg-background"
        speed={0.4}
        className="py-20 lg:py-28"
      >
        <Timeline />
      </ParallaxSection>
      <CtaBand />
    </>
  )
}
