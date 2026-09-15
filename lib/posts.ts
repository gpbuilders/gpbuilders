import type { Post } from '@/payload-types'

/**
 * Display names for the `category` select on Posts. The stored values are
 * lowercase slugs so they stay stable if a label is ever reworded.
 */
export const CATEGORY_LABELS: Record<Post['category'], string> = {
  architecture: 'Architecture',
  design: 'Design',
  sustainability: 'Sustainability',
  innovation: 'Innovation',
  projects: 'Projects',
  news: 'News',
}

/**
 * Dates are rendered on the server and never rehydrated, so pin the locale and
 * time zone. Left to the runtime default, the build machine and the browser
 * disagree and React reports a hydration mismatch.
 */
export function formatPostDate(value: string): string {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}
