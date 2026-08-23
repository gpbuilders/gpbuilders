/**
 * Builds the 1200x630 social share card at public/og-image.jpg.
 * Run with `pnpm generate:og` after changing the photo, logo, or wording.
 *
 * Note: text is rasterised here via librsvg using a system serif, not the
 * site's Marcellus webfont — the output is a baked JPEG, so it only needs to
 * look right, not match glyph-for-glyph. Regenerating on a machine without
 * Palatino will fall back down the stack.
 */
import path from 'path'
import { fileURLToPath } from 'url'

import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const W = 1200
const H = 630

const CREAM = '#f6f4ef'
const ACCENT = '#8fc0c7'

const photo = await sharp(path.join(ROOT, 'public/interior-hallway.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 1.12, saturation: 1.06 })
  .toBuffer()

// Dark scrim, heaviest on the left so the text block stays legible while the
// building itself remains visible on the right.
const scrim = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#1b2122" stop-opacity="0.92"/>
      <stop offset="42%"  stop-color="#1b2122" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#1b2122" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`)

// Tint the logo to the light accent: keep its alpha, replace the colour.
const logoAlpha = await sharp(path.join(ROOT, 'assets/gp-logo-icon.png'))
  .trim({ threshold: 1 })
  .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extractChannel('alpha')
  .toBuffer()

const logo = await sharp({
  create: { width: 96, height: 96, channels: 3, background: ACCENT },
})
  .joinChannel(logoAlpha)
  .png()
  .toBuffer()

const text = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="76" y="330" font-family="Palatino, 'Palatino Linotype', Georgia, serif"
        font-size="82" fill="${CREAM}">GP Builders</text>
  <rect x="78" y="368" width="72" height="2" fill="${ACCENT}"/>
  <text x="76" y="424" font-family="Palatino, 'Palatino Linotype', Georgia, serif"
        font-size="30" fill="${CREAM}" fill-opacity="0.88">Architecture · Interiors · Construction</text>
  <text x="78" y="512" font-family="Helvetica, Arial, sans-serif" font-size="19"
        letter-spacing="3.4" fill="${ACCENT}">QUALITY AT AN AFFORDABLE PRICE</text>
</svg>`)

await sharp(photo)
  .composite([
    { input: scrim },
    { input: logo, left: 76, top: 96 },
    { input: text },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(ROOT, 'public/og-image.jpg'))

const { size } = await sharp(path.join(ROOT, 'public/og-image.jpg')).metadata()
console.log(`public/og-image.jpg — ${W}x${H}, ${(size / 1024).toFixed(0)} KB`)
