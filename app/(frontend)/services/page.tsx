import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import { PageHero } from '@/components/page-hero'
import { getCachedHeroMedia } from '@/lib/cached-content'
import { BuildingSpecializations } from '@/components/building-specializations'
import { Process } from '@/components/process'
import { ConsultationCta } from '@/components/consultation-cta'

export const metadata: Metadata = pageMetadata({
  path: '/services',
  title: 'Construction & Interior Design Services | GP Builders',
  description:
    'Explore home construction, architecture, interior and landscape design services by GP Builders, delivered across Tamil Nadu from our Trichy studio.',
})

export default async function ServicesPage() {
  const hero = await getCachedHeroMedia()

  return (
    <>
      <PageHero
        showFeatureIcons={false}
        art={hero.pageHeroArt}
        eyebrow="What We Do"
        title="Services tailored to your project"
        description="Whether you need the complete journey or a single stage, our team adapts to where your project stands today — with transparent pricing and a clear process."
      />
      <BuildingSpecializations />
      <div className="bg-background-alt">
        <Process />
      </div>
      <ConsultationCta variant="services" />
    </>
  )
}
