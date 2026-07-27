import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Testimonials } from '@/components/testimonials'
import { Brands } from '@/components/brands'
import { CtaBand } from '@/components/cta-band'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Brands />
      <Testimonials />
      <CtaBand />
    </>
  )
}
