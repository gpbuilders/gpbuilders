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
  'JSW Steel': { src: '/brands/jsw.png', width: 796, height: 377 },
  // The orb is a gradient, so this keeps 128 palette colours.
  'Pulkit TMT': { src: '/brands/pulkit.png', width: 648, height: 343 },
  // Supplied as a portrait lockup — roundel above wordmark, 820x1167. Fitted
  // to the 32px slot whole it came out 22px wide, a sliver beside the others.
  // Cropped to the wordmark, which is the part that names the brand.
  'Vizag Steel': { src: '/brands/vizag.png', width: 820, height: 326 },
  // Also supplied as a stacked lockup, diamond above wordmark, and near
  // square at 774x814 — 30px wide in the slot, half the width of its
  // neighbours. Cropped to the bilingual wordmark for the same reason as
  // Vizag: it is the part that names the brand at this size.
  'SAIL': { src: '/brands/sail.png', width: 774, height: 177 },
  // The RR mark is a gradient, so this one keeps 256 palette colours where
  // the flat marks get away with 64 — at 64 the orange-to-red banded.
  'RR Kabel': { src: '/brands/rr-kabel.png', width: 820, height: 242 },
  'Finolex Cables': { src: '/brands/finolex.png', width: 409, height: 161 },
  'Legrand': { src: '/brands/legrand.png', width: 1182, height: 292 },
  // The only mark here with a filled ground — the red plate is part of the
  // lockup and runs to the edge of the file, so there is nothing to trim.
  'GM Modular': { src: '/brands/gm.png', width: 820, height: 379 },
  // The smallest source here at 299x61, and the widest aspect at 4.9. The
  // width cap brings it to 110x22, which the source still covers at 2x.
  'Precision': { src: '/brands/precision.png', width: 299, height: 61 },
  // Supplied at 2000px wide, roughly ten times what the capped slot needs
  // even on a 2x screen. Resampled to 800 before encoding.
  'Grohe': { src: '/brands/grohe.png', width: 800, height: 356 },
  // Supplied as the three-line "The Bold Look of KOHLER" lockup, which fitted
  // whole came to 53px wide. Cropped to the wordmark, as Vizag and SAIL were.
  'Kohler': { src: '/brands/kohler.png', width: 800, height: 174 },
  // 201px wide is the tightest source in the set — just over the 192px a 2x
  // screen asks for at the size this renders. Replace it if a larger file
  // turns up; the "always in fashion" line is a shape rather than words here.
  'Parryware': { src: '/brands/parryware.png', width: 201, height: 67 },
  'Jaquar': { src: '/brands/jaquar.png', width: 800, height: 296 },
  'Ashirvad': { src: '/brands/ashirvad.png', width: 195, height: 75 },
  'Avonplast': { src: '/brands/avonplast.png', width: 800, height: 230 },
  // The triangle is a rendered gradient, so this keeps 128 palette colours.
  // 256 was three times the size for no visible gain; 64 flattened the shading.
  'Astral Pipes': { src: '/brands/astral.png', width: 800, height: 238 },
  // Aspect 1.60, the squarest mark here — the rising stripes make it taller
  // than a plain wordmark, so height-constrained it renders narrower than the
  // rest. Kept whole: the stripes are the brand device, not a strapline.
  'Hettich': { src: '/brands/hettich.png', width: 820, height: 512 },
  // Script lettering with shading through it, so 128 colours — the same size
  // as 64 here, and it keeps the soft edges from stepping.
  'Godrej': { src: '/brands/godrej.png', width: 799, height: 370 },
  // A circular badge, so 1:1 — the only square mark here. Height-constrained
  // it renders 32x32, a third the width of the wide wordmarks beside it.
  'Yale': { src: '/brands/yale.png', width: 600, height: 600 },
  // Fine line art, so resolution costs more than colour depth here — dropping
  // from 567px to 400px saved more than halving the palette did.
  'Ebco': { src: '/brands/ebco.png', width: 400, height: 298 },
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
export const BRANDS = [
  'Dalmia Cement',
  'UltraTech Cement',
  'JSW Steel',
  'Pulkit TMT',
  'Vizag Steel',
  'SAIL',
  'RR Kabel',
  'Finolex Cables',
  'Legrand',
  'GM Modular',
  'Precision',
  'Grohe',
  'Kohler',
  'Parryware',
  'Jaquar',
  'Ashirvad',
  'Avonplast',
  'Astral Pipes',
  'Hettich',
  'Godrej',
  'Yale',
  'Ebco',
] as const
