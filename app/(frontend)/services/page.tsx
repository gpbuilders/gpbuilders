import { PageHero } from '@/components/page-hero'
import { getHeroMedia } from '@/lib/hero-media'
import { BuildingSpecializations } from '@/components/building-specializations'
import { Process } from '@/components/process'
import { ConsultationCta } from '@/components/consultation-cta'

export default async function ServicesPage() {
  const hero = await getHeroMedia()

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
