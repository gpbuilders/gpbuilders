'use client'

import { MinimalHero } from '@/components/minimal-hero'
import { FullBlogResources } from '@/components/full-blog-resources'
import { CtaBand } from '@/components/cta-band'
import { ParallaxSection } from '@/components/parallax-section'

export default function ResourcesPage() {
  return (
    <>
      <MinimalHero
        eyebrow="Resources"
        title="Resource"
        subtitle="Blog & News"
        description="Explore the latest architectural trends, innovative designs, sustainability insights, industry news, and expert tips to inspire creativity and enhance your next project."
      />
      <ParallaxSection
        backgroundColor="bg-background"
        speed={0.5}
        className=""
      >
        <FullBlogResources />
      </ParallaxSection>
      <CtaBand />
    </>
  )
}
