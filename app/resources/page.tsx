'use client'

import { PageHero } from '@/components/page-hero'
import { FullBlogResources } from '@/components/full-blog-resources'
import { CtaBand } from '@/components/cta-band'
import { ParallaxSection } from '@/components/parallax-section'

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources & Learning"
        title="Blog & News"
        description="Discover insights, project updates, and industry trends from GP Builders. Learn about sustainable design, architectural innovations, and the latest in construction technology."
        currentLabel="Resources"
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
