'use client'

import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { Projects } from '@/components/projects'
import { Brands } from '@/components/brands'
import { CtaBand } from '@/components/cta-band'
import { ParallaxSection } from '@/components/parallax-section'

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Spaces we've brought to life"
        description="From luxury homes and interiors to commercial fit-outs and landscapes, explore a selection of spaces we've designed and delivered."
        currentLabel="Projects"
      />
      <ParallaxSection
        backgroundColor="bg-background"
        speed={0.5}
        className="py-20 lg:py-28"
      >
        <Projects />
      </ParallaxSection>
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.4}
        className="py-20 lg:py-28"
      >
        <Brands />
      </ParallaxSection>
      <CtaBand />
    </>
  )
}
