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
  Kohler: { src: '/brands/kohler.jpg', width: 390, height: 130 },
  Bosch: { src: '/brands/bosch.jpg', width: 1680, height: 420 },
}

export function getBrandLogo(name: string): BrandLogo | undefined {
  return BRAND_LOGOS[name]
}
