import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import { AboutHero } from '@/components/about-hero'
import { getCachedHeroMedia } from '@/lib/cached-content'
import { About } from '@/components/about'
import { Values } from '@/components/values'
import { ViewWorkCta } from '@/components/view-work-cta'
import { Timeline } from '@/components/timeline'
import { ConsultationCta } from '@/components/consultation-cta'

export const metadata: Metadata = pageMetadata({
  path: '/about',
  title: 'About GP Builders | Construction & Interior Design Firm',
  description:
    'Learn about GP Builders, a Trichy-based firm building homes and commercial spaces across Tamil Nadu, and our commitment to transparent communication.',
})

export default async function AboutPage() {
  const hero = await getCachedHeroMedia()

  return (
    <>
      <AboutHero sketch={hero.aboutSketch} />
      <About showFounder={false} />
      <div className="bg-background-alt">
        <Values />
      </div>
      <ViewWorkCta />
      <Timeline />
      <ConsultationCta variant="about" />
    </>
  )
}
