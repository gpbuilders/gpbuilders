#!/usr/bin/env node
/**
 * Computes WCAG 2.1 contrast ratios for the colour pairs this site renders,
 * straight from the design tokens in app/(frontend)/globals.css.
 *
 * There is no test runner in this repo, and contrast is pure arithmetic, so
 * this pins the one class of accessibility bug that can be checked without a
 * browser. Lighthouse catches the rest.
 *
 * Node built-ins only — no dependencies.
 */

const hex = (h) => {
  const v = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16))
}

/** Flatten a translucent foreground onto an opaque background. */
const over = (fg, bg, alpha) =>
  hex(fg).map((c, i) => Math.round(alpha * c + (1 - alpha) * hex(bg)[i]))

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

// Tokens, copied from app/(frontend)/globals.css. If a token changes there,
// change it here too — this file deliberately does not parse the CSS, because
// a checker that silently reads the wrong value is worse than none.
const T = {
  backgroundAlt: '#e8eeec',
  darkBgDeep: '#1b2122',
  mutedForeground: '#5b6567',
  primary: '#2f6169',
  muted: '#eef0ee',
}

const AA = 4.5

const CASES = [
  {
    name: 'what-we-do nav number, default',
    fg: T.mutedForeground, bg: T.backgroundAlt, alpha: 1,
  },
  {
    name: 'what-we-do nav number, aria-current="step"',
    fg: T.primary, bg: T.backgroundAlt, alpha: 1,
  },
  {
    name: 'what-we-do nav label',
    fg: T.mutedForeground, bg: T.backgroundAlt, alpha: 1,
  },
  {
    name: 'footer copyright / legal links',
    fg: T.muted, bg: T.darkBgDeep, alpha: 0.6,
  },
]

let failed = 0
for (const c of CASES) {
  const rgb = c.alpha === 1 ? hex(c.fg) : over(c.fg, c.bg, c.alpha)
  const r = ratio(rgb, hex(c.bg))
  const ok = r >= AA
  if (!ok) failed++
  const swatch = '#' + rgb.map((n) => n.toString(16).padStart(2, '0')).join('')
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  ${swatch} on ${c.bg}  ${c.name}`,
  )
}

console.log(`\n${CASES.length - failed}/${CASES.length} pass at ${AA}:1 (WCAG AA, normal text)`)
process.exit(failed > 0 ? 1 : 0)
