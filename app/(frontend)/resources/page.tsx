import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'

import { getCachedPosts } from '@/lib/cached-content'

import { MinimalHero } from '@/components/minimal-hero'
import { FullBlogResources } from '@/components/full-blog-resources'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = pageMetadata({
  path: '/resources',
  title: 'Architecture, Construction & Interior Design Blog',
  description:
    'Read GP Builders\' insights on architecture, home construction, sustainable design and interiors for Tamil Nadu homes. Inspiration for your next build.',
})

export default async function ResourcesPage() {
  const posts = await getCachedPosts()

  return (
    <>
      <MinimalHero
        background="alt"
        title="Resources"
        subtitle="Blog & News"
        description="Explore the latest architectural trends, innovative designs, sustainability insights, industry news, and expert tips to inspire creativity and enhance your next project."
      />
      <FullBlogResources posts={posts} />
      <CtaBand />
    </>
  )
}
