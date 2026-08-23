import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import { PageHero } from '@/components/page-hero'
import { Projects } from '@/components/projects'
import { Brands } from '@/components/brands'
import { ConsultationCta } from '@/components/consultation-cta'
import { ParallaxSection } from '@/components/parallax-section'

export const metadata: Metadata = {
  title: 'Projects | GP Builders',
  description:
    "From luxury homes and interiors to commercial fit-outs and landscapes, explore a selection of spaces GP Builders has designed and delivered.",
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config })
  // depth 1 populates the image and gallery upload fields.
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    sort: 'order',
  })

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
        className=""
      >
        <Projects projects={projects} />
      </ParallaxSection>
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.4}
        className="py-20 lg:py-28"
      >
        <Brands />
      </ParallaxSection>
      <ConsultationCta variant="projects" />
    </>
  )
}
