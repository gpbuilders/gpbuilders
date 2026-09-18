import type { Metadata } from 'next'
import { AboutHero } from '@/components/about-hero'
import { getHeroMedia } from '@/lib/hero-media'
import { About } from '@/components/about'
import { Values } from '@/components/values'
import { ViewWorkCta } from '@/components/view-work-cta'
import { Timeline } from '@/components/timeline'
import { ConsultationCta } from '@/components/consultation-cta'
import { ParallaxSection } from '@/components/parallax-section'

export default async function AboutPage() {
  const hero = await getHeroMedia()

  return (
    <>
      <AboutHero sketch={hero.aboutSketch} />
      <About />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.6}
        className=""
      >
        <Values />
      </ParallaxSection>
      <ViewWorkCta />
      <ParallaxSection
        backgroundColor="bg-background-alt"
        speed={0.4}
        className=""
      >
        <Timeline />
      </ParallaxSection>
      <ConsultationCta variant="about" />
    </>
  )
}
