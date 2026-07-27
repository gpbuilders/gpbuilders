import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Values } from '@/components/values'
import { Milestones } from '@/components/milestones'
import { Process } from '@/components/process'
import { Projects } from '@/components/projects'
import { Brands } from '@/components/brands'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Values />
        <Milestones />
        <Process />
        <Projects />
        <Brands />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
