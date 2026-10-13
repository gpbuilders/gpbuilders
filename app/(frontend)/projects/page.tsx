import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import config from '@payload-config'
import { getPayload } from 'payload'

import { PageHero } from '@/components/page-hero'
import { getHeroMedia } from '@/lib/hero-media'
import { Projects } from '@/components/projects'
import { Brands } from '@/components/brands'
import { ConsultationCta } from '@/components/consultation-cta'

export const metadata: Metadata = pageMetadata({
  path: '/projects',
  title: 'Construction & Interior Design Projects | GP Builders',
  description:
    'Explore residential and commercial projects by GP Builders across Tamil Nadu, including Trichy, Chennai and Pudukkottai. View our construction portfolio.',
})

export default async function ProjectsPage() {
  // Independent of one another, so they go together rather than as two serial
  // round trips to Sydney — see the home page for the same reasoning.
  const [hero, { docs: projects }] = await Promise.all([
    getHeroMedia(),
    // depth 1 populates the image and gallery upload fields.
    getPayload({ config }).then((payload) =>
      payload.find({
        collection: 'projects',
        depth: 1,
        limit: 100,
        sort: 'order',
      }),
    ),
  ])

  return (
    <>
      <PageHero
        showFeatureIcons={false}
        art={hero.pageHeroArt}
        eyebrow="Our Work"
        title="Spaces we've brought to life"
        description="From luxury homes and interiors to commercial fit-outs and landscapes, explore a selection of spaces we've designed and delivered."
      />
      <div className="bg-background">
        <Projects projects={projects} />
      </div>
      <div className="bg-background-alt py-20 lg:py-28">
        <Brands />
      </div>
      <ConsultationCta variant="projects" />
    </>
  )
}
