'use client'

import { Hero } from '@/components/hero'
import { WhatWeDo } from '@/components/what-we-do'
import { About } from '@/components/about'
import { Testimonials } from '@/components/testimonials'
import { BrandsWeBuild } from '@/components/brands-we-build'
import { BlogResources } from '@/components/blog-resources'
import { CtaBand } from '@/components/cta-band'
import { ParallaxSection } from '@/components/parallax-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.5}
        className="py-20 lg:py-28"
      >
        <WhatWeDo />
      </ParallaxSection>
      <About />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.4}
        className="py-20 lg:py-28"
      >
        <Testimonials />
      </ParallaxSection>
      <BrandsWeBuild />
      <ParallaxSection
        backgroundColor="bg-background"
        speed={0.5}
        className=""
      >
        <BlogResources />
      </ParallaxSection>
      <CtaBand />
    </>
  )
}
