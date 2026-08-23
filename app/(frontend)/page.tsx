'use client'

import { Hero } from '@/components/hero'
import { WhatWeDo } from '@/components/what-we-do'
import { About } from '@/components/about'
import { HowWeDeliver } from '@/components/how-we-deliver'
import { Testimonials } from '@/components/testimonials'
import { BrandsWeBuild } from '@/components/brands-we-build'
import { SelectedWork } from '@/components/selected-work'
import { ConsultationCta } from '@/components/consultation-cta'
import { ParallaxSection } from '@/components/parallax-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.5}
        className=""
      >
        <WhatWeDo />
      </ParallaxSection>
      <About />
      <HowWeDeliver />
      <ParallaxSection
        backgroundColor="bg-dark-bg"
        speed={0.4}
        className=""
      >
        <Testimonials />
      </ParallaxSection>
      <BrandsWeBuild />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.5}
        className=""
      >
        <SelectedWork />
      </ParallaxSection>
      <ConsultationCta />
    </>
  )
}
