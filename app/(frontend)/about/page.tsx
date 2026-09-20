import { AboutHero } from '@/components/about-hero'
import { getHeroMedia } from '@/lib/hero-media'
import { About } from '@/components/about'
import { Values } from '@/components/values'
import { ViewWorkCta } from '@/components/view-work-cta'
import { Timeline } from '@/components/timeline'
import { ConsultationCta } from '@/components/consultation-cta'

export default async function AboutPage() {
  const hero = await getHeroMedia()

  return (
    <>
      <AboutHero sketch={hero.aboutSketch} />
      <About />
      <div className="bg-background-alt">
        <Values />
      </div>
      <ViewWorkCta />
      <Timeline />
      <ConsultationCta variant="about" />
    </>
  )
}
