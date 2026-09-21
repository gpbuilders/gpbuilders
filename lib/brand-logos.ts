export type BrandLogo = {
  src: string
  /** Intrinsic pixel dimensions of the file — needed so the browser reserves the right box. */
  width: number
  height: number
}

/**
 * Brand logos, keyed by the exact brand name used in a section's list.
 * Brands with no entry here fall back to rendering their name as text,
 * so a section keeps working before its logos are added.
 *
 * To add one: drop the file in `public/brands/`, then add a row below with
 * the file's real pixel dimensions.
 */
export const BRAND_LOGOS: Record<string, BrandLogo> = {
  // Both arrived with a transparent margin around the mark. object-contain
  // fits the whole file into the 32px slot, so an untrimmed one renders
  // visibly smaller than its neighbours; these are cropped to the artwork.
  'Dalmia Cement': { src: '/brands/dalmia.png', width: 1141, height: 538 },
  // Black on transparent, so it ships as a palette PNG — a full-colour one
  // spent 147KB on a palette it never used.
  'UltraTech Cement': { src: '/brands/ultratech.png', width: 597, height: 233 },
}

export function getBrandLogo(name: string): BrandLogo | undefined {
  return BRAND_LOGOS[name]
}

/**
 * The brands shown in both "Brands We Build With" on the home page and
 * "Brands We Use" on the projects page.
 *
 * One list, because two lists drifted — the sections had diverged to the
 * point where only four of seventeen names appeared in both, and one was
 * spelled two ways. Adding a brand here puts it in both sections.
 *
 * Both layouts size themselves from the count, so this can be any length.
 */
export const BRANDS = ['Dalmia Cement', 'UltraTech Cement'] as const
