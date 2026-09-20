import config from '@payload-config'
import { getPayload } from 'payload'

import { getHeroMedia } from '@/lib/hero-media'

import { Hero } from '@/components/hero'
import { WhatWeDo } from '@/components/what-we-do'
import { About } from '@/components/about'
import { HowWeDeliver } from '@/components/how-we-deliver'
import { Testimonials } from '@/components/testimonials'
import { BrandsWeBuild } from '@/components/brands-we-build'
import { SelectedWork } from '@/components/selected-work'
import { ConsultationCta } from '@/components/consultation-cta'

export default async function HomePage() {
  const hero = await getHeroMedia()
  const payload = await getPayload({ config })
  // Only the four the Featured Projects layout can show.
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 4,
    sort: 'order',
  })

  return (
    <>
      <Hero slides={hero.homeSlides} />
      <WhatWeDo />
      <About />
      <HowWeDeliver />
      <div className="bg-dark-bg">
        <Testimonials />
      </div>
      <BrandsWeBuild />
      <div className="bg-background-alt">
        <SelectedWork projects={projects} />
      </div>
      <ConsultationCta />
    </>
  )
}
