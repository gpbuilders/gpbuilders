import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/page-metadata'
import config from '@payload-config'
import { getPayload } from 'payload'

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
