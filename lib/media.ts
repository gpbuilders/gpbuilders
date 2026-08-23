import type { Media } from '@/payload-types'

/**
 * Upload fields come back as an ID when the query depth is 0 and as a populated
 * Media document otherwise. Query with depth >= 1 and these stay meaningful.
 */
export type MediaField = number | Media | null | undefined

export function mediaUrl(media: MediaField, fallback = '/placeholder.svg'): string {
  return typeof media === 'object' && media?.url ? media.url : fallback
}

export function mediaAlt(media: MediaField, fallback = ''): string {
  return typeof media === 'object' && media?.alt ? media.alt : fallback
}
