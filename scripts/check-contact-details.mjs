#!/usr/bin/env node
/**
 * Fails if the site would publish a way to contact GP Builders that is not
 * the real one.
 *
 * Three times now the site has carried a contact detail that was not the
 * company's. The contact page published hello@gpbuilders.in — a domain GP
 * Builders does not own, which is live and accepting mail — until 29
 * September 2026, and Google was still answering "gp builders" with that
 * address two weeks later, citing our own page. The enquiry form shipped
 * you@example.com and +91 98765 43210 as placeholders, sitting on the one
 * page whose job is to say how to reach the company.
 *
 * Each was obvious once someone looked. The problem is that nobody looks at a
 * placeholder, and a wrong address is invisible until it is in front of
 * everyone searching for the firm. So this looks instead.
 *
 * WHAT IT SCANS
 *   - our own source under app/, components/ and lib/
 *   - everything in .next/static, if a build exists: the files a browser
 *     actually downloads
 *
 * .next/server is deliberately NOT scanned. It carries vendored library code
 * as well as ours — Payload alone compiles its own info@payloadcms.com into
 * the admin chunks — and a check that cries wolf on every run is a check
 * people learn to ignore. Nothing is lost: anything of ours that reaches a
 * server chunk came from the source scanned above.
 *
 * It does not scan the database. A wrong address typed into a project
 * description would not be caught here, and that is worth knowing rather than
 * pretending otherwise.
 *
 * COMMENT LINES ARE SKIPPED, deliberately. The comment in
 * components/structured-data.tsx names the old address on purpose, because
 * the warning is useless without it, and a comment is not served to anyone.
 * A line is treated as a comment when it starts with //, * or \/*, which is
 * every form this codebase actually uses. A trailing comment after code is
 * not skipped — that errs towards a false alarm, which is the right way round.
 *
 * Node built-ins only, no dependencies, no build required.
 *
 * Run: npm run check:contact
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The only contact details the site may publish.
 *
 * Add to these when the company genuinely gains an address or a number — and
 * when one is retired, take it out here FIRST, so the check tells you
 * everywhere it still appears.
 */
const ALLOWED_EMAILS = ['projects@gpbuildersgroup.com']
const ALLOWED_PHONES = ['+919363699574', '+91 93636 99574']

/** Domains that must never appear at all, in any form, not just as an address. */
const BANNED_HOSTS = ['gpbuilders.in']

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
// Only +91 numbers. A general phone pattern matches version strings, hashes
// and half the contents of a build directory.
const PHONE = /\+91[\s-]?[0-9][\s0-9-]{7,13}[0-9]/g

const SOURCE_DIRS = ['app', 'components', 'lib']
const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'])

const BUILD_DIRS = ['.next/static']
// Source maps carry the original source, comments included, and Next does not
// serve them unless productionBrowserSourceMaps is turned on.
const SKIP_BUILD_EXT = new Set(['.map'])

function walk(dir, keep) {
  const out = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.git') continue
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) out.push(...walk(full, keep))
    else if (keep(full)) out.push(full)
  }
  return out
}

const isComment = (line) => {
  const t = line.trim()
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')
}

const normalisePhone = (value) => value.replace(/[\s-]/g, '')

/** Every offending match in one file, with the line it sits on. */
function scan(file, { skipComments }) {
  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    return []
  }

  const findings = []
  const lines = text.split('\n')

  lines.forEach((line, i) => {
    if (skipComments && isComment(line)) return

    for (const match of line.match(EMAIL) ?? []) {
      if (!ALLOWED_EMAILS.includes(match)) {
        findings.push({ file, line: i + 1, kind: 'email', value: match })
      }
    }

    for (const match of line.match(PHONE) ?? []) {
      const normalised = normalisePhone(match)
      if (!ALLOWED_PHONES.some((p) => normalisePhone(p) === normalised)) {
        findings.push({ file, line: i + 1, kind: 'phone', value: match })
      }
    }

    for (const host of BANNED_HOSTS) {
      if (line.includes(host)) {
        findings.push({ file, line: i + 1, kind: 'banned host', value: host })
      }
    }
  })

  return findings
}

const rel = (file) => path.relative(ROOT, file)

let findings = []

// Pass 1 — our own source.
const sourceFiles = SOURCE_DIRS.flatMap((dir) =>
  walk(path.join(ROOT, dir), (f) => SOURCE_EXT.has(path.extname(f))),
)
for (const file of sourceFiles) findings.push(...scan(file, { skipComments: true }))
console.log(`source:  ${sourceFiles.length} files under ${SOURCE_DIRS.join(', ')}`)

// Pass 2 — the build output, when one exists. Comments are already gone here,
// so nothing is skipped: whatever is left is what ships.
const builtDirs = BUILD_DIRS.filter((d) => existsSync(path.join(ROOT, d)))
if (builtDirs.length) {
  const builtFiles = builtDirs.flatMap((dir) =>
    walk(path.join(ROOT, dir), (f) => !SKIP_BUILD_EXT.has(path.extname(f))),
  )
  for (const file of builtFiles) findings.push(...scan(file, { skipComments: false }))
  console.log(`build:   ${builtFiles.length} files under ${builtDirs.join(', ')}`)
} else {
  console.log('build:   skipped, no .next directory — run `npm run build` to include it')
}

// One line per distinct value, with every place it appears. A placeholder
// compiled into forty chunks is one mistake, not forty.
const byValue = new Map()
for (const f of findings) {
  const key = `${f.kind}:${f.value}`
  if (!byValue.has(key)) byValue.set(key, [])
  byValue.get(key).push(f)
}

console.log()
if (!byValue.size) {
  console.log(`PASS  the only contact details present are ${ALLOWED_EMAILS.join(', ')} and ${ALLOWED_PHONES[0]}`)
  process.exit(0)
}

for (const [key, places] of byValue) {
  const [kind, ...rest] = key.split(':')
  console.log(`FAIL  ${kind}  ${rest.join(':')}`)
  for (const p of places.slice(0, 5)) console.log(`        ${rel(p.file)}:${p.line}`)
  if (places.length > 5) console.log(`        ...and ${places.length - 5} more`)
}

console.log(`\n${byValue.size} contact detail(s) that are not GP Builders'.`)
console.log('Either remove them, or add them to ALLOWED_EMAILS / ALLOWED_PHONES in this file.')
process.exit(1)
