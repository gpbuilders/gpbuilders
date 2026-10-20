import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import { getCachedHeroMedia, getCachedHomeProjects } from '@/lib/cached-content'

import { Hero } from '@/components/hero'
import { WhatWeDo } from '@/components/what-we-do'
import { About } from '@/components/about'
import { HowWeDeliver } from '@/components/how-we-deliver'
import { Testimonials } from '@/components/testimonials'
import { BrandsWeBuild } from '@/components/brands-we-build'
import { SelectedWork } from '@/components/selected-work'
import { ConsultationCta } from '@/components/consultation-cta'

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Builders & Interior Designers in Trichy | GP Builders',
  description:
    'GP Builders is a Trichy-based construction, architecture and interior design firm working across Tamil Nadu, on homes and commercial spaces alike.',
})

export default async function HomePage() {
  // Neither read needs the other's answer, so they go together — and both are
  // held between requests now, so on a warm server this pair costs nothing
  // rather than the ~930ms of Sydney round trips it used to. See
  // lib/cached-content.ts for what that buys and what it costs.
  const [hero, projects] = await Promise.all([
    getCachedHeroMedia(),
    getCachedHomeProjects(),
  ])

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
