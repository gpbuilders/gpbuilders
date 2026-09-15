import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import { MinimalHero } from '@/components/minimal-hero'
import { FullBlogResources } from '@/components/full-blog-resources'
import { CtaBand } from '@/components/cta-band'
import { ParallaxSection } from '@/components/parallax-section'

export const metadata: Metadata = {
  title: 'Resources | GP Builders',
  description:
    'Architectural trends, sustainability insights, industry news and practical tips from the GP Builders team.',
}

export default async function ResourcesPage() {
  const payload = await getPayload({ config })
  // depth 1 populates coverImage.
  //
  // overrideAccess defaults to TRUE on the Local API — it assumes server-side
  // code is trusted. Without this flag the collection's read rule is skipped
  // entirely and unpublished drafts are rendered onto the public page.
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50,
    sort: '-publishedAt',
    overrideAccess: false,
  })

  return (
    <>
      <MinimalHero
        title="Resource"
        subtitle="Blog & News"
        description="Explore the latest architectural trends, innovative designs, sustainability insights, industry news, and expert tips to inspire creativity and enhance your next project."
      />
      <ParallaxSection
        backgroundColor="bg-background"
        speed={0.5}
        className=""
      >
        <FullBlogResources posts={posts} />
      </ParallaxSection>
      <CtaBand />
    </>
  )
}
