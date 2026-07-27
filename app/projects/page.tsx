import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { Projects } from '@/components/projects'
import { Brands } from '@/components/brands'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'Projects | GP Builders',
  description:
    'Browse GP Builders projects across residential and commercial spaces — homes, interiors, landscapes, and commercial fit-outs delivered with quality and care.',
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Spaces we've brought to life"
        description="From luxury homes and interiors to commercial fit-outs and landscapes, explore a selection of spaces we've designed and delivered."
        currentLabel="Projects"
      />
      <Projects />
      <Brands />
      <CtaBand />
    </>
  )
}
