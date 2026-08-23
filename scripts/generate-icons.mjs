/**
 * Regenerates the favicon / app-icon set from assets/gp-logo-icon.png.
 * Run with `pnpm generate:icons` after changing the source logo.
 */
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'assets/gp-logo-icon.png')

const CREAM = { r: 0xf6, g: 0xf4, b: 0xef, alpha: 1 } // --background
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

// Tight-crop first: the source has transparent margins, so cropping once here
// means every size below is built from identical content.
const trimmed = await sharp(SRC).trim({ threshold: 1 }).png().toBuffer()
const { width, height } = await sharp(trimmed).metadata()
console.log(`trimmed content: ${width}x${height}`)

/** Square canvas of `size` with the artwork scaled to `coverage` and centred. */
async function icon(size, { coverage, background }) {
  const inner = Math.round(size * coverage)
  const art = await sharp(trimmed)
    .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
    .toBuffer()
  const pad = size - inner
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? TRANSPARENT,
    },
  })
    .composite([{ input: art, left: Math.floor(pad / 2), top: Math.floor(pad / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** ICO container with PNG-encoded entries (supported by every current browser). */
function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)

  const entries = Buffer.alloc(16 * images.length)
  let offset = 6 + 16 * images.length

  images.forEach(({ size, data }, i) => {
    const e = 16 * i
    entries.writeUInt8(size >= 256 ? 0 : size, e + 0) // width (0 means 256)
    entries.writeUInt8(size >= 256 ? 0 : size, e + 1) // height
    entries.writeUInt8(0, e + 2) // palette size
    entries.writeUInt8(0, e + 3) // reserved
    entries.writeUInt16LE(1, e + 4) // colour planes
    entries.writeUInt16LE(32, e + 6) // bits per pixel
    entries.writeUInt32LE(data.length, e + 8)
    entries.writeUInt32LE(offset, e + 12)
    offset += data.length
  })

  return Buffer.concat([header, entries, ...images.map((i) => i.data)])
}

mkdirSync(path.join(ROOT, 'public/icons'), { recursive: true })
const write = (rel, buf) => {
  writeFileSync(path.join(ROOT, rel), buf)
  console.log(`  ${rel} (${buf.length.toLocaleString()} bytes)`)
}

// favicon.ico — 16/32/48, cropped tight so the leaves stay legible in a tab.
const ico = []
for (const size of [16, 32, 48]) {
  ico.push({ size, data: await icon(size, { coverage: 0.94 }) })
}
write('app/favicon.ico', buildIco(ico))

// Next.js file-convention icons at app/ root, so the site and the Payload
// admin panel both pick them up.
write('app/icon.png', await icon(512, { coverage: 0.9 }))
// iOS composites transparency against black, so this one needs a real
// background and extra breathing room for the rounded-corner mask.
write('app/apple-icon.png', await icon(180, { coverage: 0.78, background: CREAM }))

// Standalone PNGs for the manifest and explicit <link> use.
for (const size of [16, 32, 48, 96, 192, 512]) {
  write(`public/icons/favicon-${size}x${size}.png`, await icon(size, { coverage: 0.94 }))
}

// Maskable icons: Android crops to a circle/squircle, so the artwork stays
// inside the inner 80% safe zone on an opaque background.
for (const size of [192, 512]) {
  write(
    `public/icons/maskable-${size}x${size}.png`,
    await icon(size, { coverage: 0.62, background: CREAM }),
  )
}

console.log('done')
