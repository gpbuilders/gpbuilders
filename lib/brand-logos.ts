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
  // Replaced: the file here was "& PRECISION", a green-and-navy wordmark for
  // a different company entirely. This is Precision Pipes, which is why the
  // row also moved out of the electrical group and in beside Astral and
  // Ashirvad. Resampled from 679 to 400, as Crompton was — a detailed mark
  // costs more in resolution than in palette depth, and 400 still covers 3x.
  'Precision Pipes': { src: '/brands/precision.png', width: 400, height: 111 },
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
  // Came as a Twitter avatar: ink on an opaque white square, where every other
  // mark here is transparent. The white is keyed back out to alpha so it does
  // not sit as a plate on the projects page's hover tint. Cropped to the
  // wordmark — the strapline under it was 13px of a 132px lockup and would
  // have rendered about 3px tall.
  'Alteza': { src: '/brands/alteza.png', width: 356, height: 104 },
  // Arrived transparent but padded — 200x52 of artwork inside a 270x85 canvas,
  // which object-contain would have fitted whole and rendered a fifth small.
  // The diamond is a gradient, so 128 palette colours, which cost the same as
  // 64 here where 256 nearly tripled the file. 200px is the tightest source in
  // the set: a 2x screen wants 220 at this width. The site's only other copy
  // (logo-2.webp) is the same artwork with less padding, not a larger one.
  'Encraft': { src: '/brands/encraft.png', width: 200, height: 52 },
  // Aspect 5.50, the widest mark here — it hits the 110px width cap before it
  // reaches the 32px height, so it renders 110x20 and reads shorter than its
  // neighbours. That is the lockup, not a crop. The ribbon is a gradient, so
  // 128 palette colours, which cost the same as 64 where 256 doubled the file.
  'Asian Paints': { src: '/brands/asian-paints.png', width: 820, height: 149 },
  // The only vector source in the set — an SVG, so it was rendered oversized,
  // cropped to the artwork at that resolution and resampled down to 800. Flat
  // black lettering and four flat dots, so 32 palette colours; 64 was the same
  // size. Resolution is free here: re-render from the SVG if the slot grows.
  'Birla Opus': { src: '/brands/birla-opus.png', width: 800, height: 311 },
  // The smallest file in the set by a distance, and deliberately so: the badge
  // is near square, so it renders 37px wide and a 2x screen asks for only 74.
  // The 131px supplied covers that comfortably. Kept whole — the brush splash
  // is the ground the lettering sits on, so there is nothing to crop to.
  'MRF Vapocure': { src: '/brands/mrf-vapocure.png', width: 131, height: 113 },
  // Another white-ground avatar keyed back out to alpha, and the key matters
  // more here than it did for Alteza: the skyline is outline strokes, so the
  // white *between* them has to go too, not just the white around the lockup.
  // Stacked, but at aspect 2.39 it renders 76px and needs no rescuing — the
  // wordmark cropped out on its own would be a 110x11 sliver. The skyline
  // gradient survives 64 colours; 128 is the same size, 256 was four times it.
  'Saint-Gobain': { src: '/brands/saint-gobain.png', width: 370, height: 155 },
  // Keyed off white like the other avatars. This one has a solid mid-grey in
  // the mark, which unpremultiplying reads as translucent black — on the
  // projects page's hover tint it lands 16 levels dark. Keying only the
  // near-white fringe instead holds the grey exactly, but leaves the JPEG's
  // ringing fully opaque as coloured speckle around the letters, which is far
  // more visible. Measured both; the slight shift is the better trade.
  'Gyproc': { src: '/brands/gyproc.png', width: 370, height: 100 },
  // Supplied at 150x24, which at aspect 6.05 renders 110px wide — a 2x screen
  // wants 220, so it would have been upscaled and soft, the only file here
  // that could not cover its own slot. Rebuilt from the vector on Wikimedia
  // Commons instead (same mark, grey within four levels, same crimson).
  'Häfele': { src: '/brands/hafele.png', width: 800, height: 132 },
  // Transparent as supplied, needing only 4px of padding cropped off. Stacked
  // star above wordmark, kept whole at 71px — the star is the brand device,
  // and this is nowhere near the sliver that forced the Vizag and SAIL crops.
  // One flat red, so 16 palette colours; 32 and 64 were the same size.
  'CenturyPly': { src: '/brands/centuryply.png', width: 400, height: 180 },
  // Transparent already; one column of padding cropped. The star is full
  // height beside a thin serif wordmark, so at 68px the lettering renders
  // lighter than the bold marks either side of it — that is the lockup, and
  // there is no cropping it out of a horizontal arrangement.
  'Sharon': { src: '/brands/sharon.png', width: 378, height: 179 },
  // Cropped to the wordmark and its tree, dropping the "Ply Mane Kitply"
  // strapline below it — whole it rendered 47px, among the smallest here, and
  // without the strapline it renders 63px, in line with Sharon and CenturyPly.
  // Same call as Alteza; the tree sits inside the kept band, so the mark is
  // intact and only the tagline is gone.
  'Kitply': { src: '/brands/kitply.png', width: 300, height: 153 },
  // The one mark here that is not the brand's own arrangement. Greenlam
  // publishes a portrait lockup — arch above wordmark — which at aspect 0.74
  // renders 24px wide, too small to read the arch that makes it recognisable;
  // cropping to the wordmark instead reads at 104px but loses the arch
  // entirely. Neither kept both, so the two halves are set side by side here:
  // arch at full height, wordmark centred against it, 65px and both legible.
  // Swap back to the official portrait (101x136 at 36,7 of the source) if the
  // brand's own arrangement matters more than the size.
  'Greenlam': { src: '/brands/greenlam.png', width: 196, height: 96 },
  // The second filled-plate mark after GM Modular, and the only fully opaque
  // file here — the yellow plate and its cyan rule are the lockup, so there is
  // no background to remove. Cropped a pixel inside the plate's edge rather
  // than to it: the outermost pixels of the avatar are cyan blended with the
  // white around it, and keeping them would have drawn a pale halo on the
  // projects page's hover tint. Colours stay exact on any ground this way.
  'Archidply': { src: '/brands/archidply.png', width: 274, height: 109 },
  // The largest source here by far — 2560x1450, nearly all of it white margin.
  // Cropped to the 1476x271 wordmark, keyed off white, then resampled to 800,
  // in that order: keying before the resize means the antialiased fringe
  // scales as alpha rather than as pale blue over white. One flat blue, so 16
  // palette colours. Aspect 5.45 puts it at the width cap like Asian Paints,
  // so it renders 110x20 and reads shorter than the boxier marks.
  'Philips': { src: '/brands/philips.png', width: 800, height: 147 },
  // Transparent already; five columns of padding cropped. The dotted spiral
  // runs the full spectrum, so this is one of the few marks here that really
  // is a gradient — 128 palette colours, which cost the same as 64 where 256
  // added half again. The "lighting" half is thin and pale, so it reads faint
  // beside the solid wordmarks; that is the lockup, not the encoding.
  'Wipro Lighting': { src: '/brands/wipro.png', width: 815, height: 362 },
  // The only white-on-dark mark here, so unlike every other avatar its ground
  // cannot be removed — keyed off its charcoal it would be a white logo on a
  // white card, invisible. Kept as a filled badge instead, alongside GM
  // Modular and Archidply. Square, so it renders 32x32, the joint smallest
  // with Yale. Source is a 150px Instagram avatar, the only artwork the brand
  // publishes that could be found: acepro.in is a different company (Sarthi
  // Group) and aceprolighting.com ships its theme's placeholder logo. That
  // still covers 2x at this size, but a real file from the supplier would let
  // it render larger and, if it has a dark-on-light variant, lose the plate.
  'AcePro': { src: '/brands/acepro.png', width: 150, height: 150 },
  // Supplied at 100x22, the smallest source offered here — at aspect 4.46 it
  // renders 110px wide, so that would have been a 2.2x upscale. Crompton's
  // store runs on Shopify, whose CDN honours a width parameter, so the same
  // file came back at 1151x258 (same mark, same blue within one level).
  // Resampled to 400 rather than the usual 800: at 800 this was 15KB, the
  // largest file in the set, and 400 still covers a 3x screen. Same reasoning
  // as Ebco — for a detailed mark, resolution costs more than palette depth.
  'Crompton': { src: '/brands/crompton.png', width: 400, height: 90 },
  // Transparent already; 70 rows of vertical padding cropped off. Kept at the
  // full 820 rather than resampled like Crompton — at 6.5KB it is not an
  // outsized file, and the "Why not?" line is fine enough that not resampling
  // is worth the bytes. Flat black and one flat yellow, so 32 palette colours.
  'Atomberg': { src: '/brands/atomberg.png', width: 820, height: 186 },
  // Taken from the brand's own site: the x.com photo page serves a JS shell
  // with no image in the markup. Their footer mark is only a 76x42 "WT", and
  // the homepage logo is the white-on-dark version, so this is the black one
  // from media/logo. Cropped to the monogram and wordmark, dropping the rule
  // and the small "ap" below them — that is the Asian Paints endorsement
  // (they own White Teak), and Asian Paints is already its own row here, so
  // nesting its mark inside another brand's logo would only confuse.
  'White Teak': { src: '/brands/white-teak.png', width: 401, height: 106 },
  // The URL given served 265x50, which clears 2x but leaves no margin. Its
  // path encodes the rendition (…-origx50-webp-), and the cache honours other
  // heights, so origx400 returned the same mark at 2119x400; resampled here
  // to 400. One flat blue, so 32 palette colours.
  'Duravit': { src: '/brands/duravit.png', width: 400, height: 76 },
  // Kept whole, though the three descriptor lines render about 3px tall.
  // Cropping to the mark is the usual answer to that and is the wrong one
  // here: alone it is aspect 1.64, so it renders 53px and wants 106 at 2x
  // while having only 92. The full lockup renders 110px on 255px of source.
  // The brand publishes nothing larger — the one bigger file in their media
  // library is a "Seeking Distributorship" badge, not the logo.
  'Alpine': { src: '/brands/alpine.png', width: 255, height: 56 },
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
  'Grohe',
  'Kohler',
  'Parryware',
  'Jaquar',
  'Ashirvad',
  'Avonplast',
  'Astral Pipes',
  'Precision Pipes',
  'Hettich',
  'Godrej',
  'Yale',
  'Ebco',
  'Alteza',
  'Encraft',
  'Asian Paints',
  'Birla Opus',
  'MRF Vapocure',
  'Saint-Gobain',
  'Gyproc',
  'Häfele',
  'CenturyPly',
  'Sharon',
  'Kitply',
  'Greenlam',
  'Archidply',
  'Philips',
  'Wipro Lighting',
  'AcePro',
  'Crompton',
  'Atomberg',
  'White Teak',
  'Duravit',
  'Alpine',
] as const
