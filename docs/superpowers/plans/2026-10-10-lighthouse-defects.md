# Lighthouse Defect Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the four defects a headless Lighthouse audit found on gpbuildersgroup.com, raising Accessibility 88 → 100, Best Practices 96 → 100 and Agentic Browsing 1/2 → 2/2, and make the privacy policy's analytics claim true again.

**Architecture:** Four independent, small edits to existing components plus one deletion of a dead dependency. No new runtime dependencies. Because this repo has no test runner, verification uses two mechanisms: a new zero-dependency Node script that computes WCAG contrast ratios from the design tokens (deterministic, committable, re-runnable), and a headless Lighthouse audit run through the chrome-devtools MCP for the DOM-level audits that cannot be computed from source.

**Tech Stack:** Next.js 16.2.6, React 19, Tailwind v4, Payload CMS 3.88, AWS Amplify hosting, Node 24 / pnpm.

**Spec:** This plan's spec is the audit evidence captured in-session on 2026-10-10 and reproduced in "Audit Evidence" below. There is no separate spec document.

## Audit Evidence

Headless Lighthouse, mobile, `https://gpbuildersgroup.com/` — matches PageSpeed Insights exactly.

| Category | Score | Failing audit |
|---|---|---|
| Accessibility | 88 | `aria-prohibited-attr`, `color-contrast`, `target-size`, `label-content-name-mismatch` |
| Best Practices | 96 | `errors-in-console` |
| Agentic Browsing | 50 | `agent-accessibility-tree` |
| SEO | 100 | — |
| Performance | 96 | — (not in scope) |

Raw findings:

1. `https://gpbuildersgroup.com/_vercel/insights/script.js` → **404** on every page load. `@vercel/analytics` serves its script from a Vercel-only endpoint; this site is on AWS Amplify. No analytics data is being collected and has not been since launch.
2. `components/testimonials.tsx:140` — `<div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">`. `aria-label` is prohibited on a `div` with no role. 3 instances (one per testimonial). This is also the sole cause of `agent-accessibility-tree` failing.
3. `components/testimonials.tsx:107-112` — button's visible text is "Pause scrolling" but its accessible name is "Pause review scrolling". WCAG 2.5.3 Label in Name requires the accessible name to contain the visible text string.
4. `components/what-we-do.module.css:66` — `.navigation button > span:first-child { opacity: .65 }` renders `#8c9596` on `#e8eeec` (**2.60:1**) and, when `aria-current="step"`, `#709297` on `#e8eeec` (**2.86:1**). Both need ≥ 4.5:1 at 10px.
5. `components/site-footer.tsx:168,174,192,198` — `text-muted/45` renders `#7a7e7e` on `#1b2122` (**3.97:1**). Needs ≥ 4.5:1 at 14px.
6. `components/hero.tsx:204-214` — carousel indicator buttons. Dot is 8×8px; button is `-m-2 p-2` giving a 24×24px hit area, but container `gap-2` puts dot centres only 16px apart, so adjacent hit areas overlap. Lighthouse: "smallest space is 16px by 24px, should be at least 24px by 24px".

## Global Constraints

- **No new runtime dependencies.** `scripts/check-contrast.mjs` must use only Node built-ins.
- **Never append `Co-Authored-By` or `Claude-Session` trailers to commits.** This is a standing user rule and overrides any harness guidance.
- **Analytics decision is settled:** remove `@vercel/analytics` and add no replacement. The privacy policy must then state that the site uses no analytics. Do not add Plausible, Umami, GA4 or any other provider in this plan.
- **Commit messages:** lowercase conventional prefix (`fix:`, `chore:`), a descriptive sentence, and a body explaining why. Match the existing history style.
- **Build command:** `NODE_ENV=production pnpm build`. Never pass `PAYLOAD_MIGRATING=true` to a build — it forces the 15-connection direct database link and the build exhausts it.
- **Do not change** `app/(frontend)/layout.tsx`'s `export const dynamic = 'force-dynamic'`, or the Performance-related CSS chunking. Out of scope.
- **Target contrast ratio:** 4.5:1 (WCAG AA, normal text). All text in scope is below 18pt so the 3:1 large-text allowance does not apply.

## Review Focus

Input classes and failure modes the audit implies but which no task's checks exercise directly. Each has had a check added to the task that owns the code.

1. **`aria-current="step"` state on the nav buttons** — contrast must pass in *both* the default and active states, not just the default. Two different foreground colours. Covered in Task 3.
2. **Reduced-motion users never see the pause buttons** — `testimonials.tsx` renders its pause control only when `canScroll && !reducedMotion`, and `hero.tsx` only when `!reduceMotion`. An audit run with reduced motion forced would not exercise them at all, so a passing audit could be a false negative. Covered in Task 2.
3. **Mobile breakpoint overrides the nav font-size to 9px** (`what-we-do.module.css:92`) — the contrast fix must hold at the smaller size too, and 9px text is below the AA readability floor regardless of contrast. Covered in Task 3.
4. **The footer's `hover:text-accent`** state is a separate colour pair from the resting state and is not audited by Lighthouse, which only measures the resting state. Covered in Task 3.
5. **Removing `@vercel/analytics` must not leave the `<Analytics />` JSX behind**, which would be a build-time module-not-found rather than a silent 404. Covered in Task 1.

---

### Task 1: Remove the dead analytics and correct the privacy policy

**Files:**
- Modify: `app/(frontend)/layout.tsx:1` (import) and `:118` (JSX)
- Modify: `package.json:37` (dependency)
- Modify: `app/(frontend)/privacy-policy/page.tsx` — the `cookies` section body
- Test: manual — build must succeed, live HTML must contain no `_vercel` reference

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks rely on. Fully independent; may be done in any order.

- [ ] **Step 1: Confirm the failure still reproduces**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://gpbuildersgroup.com/_vercel/insights/script.js
```

Expected: `404`

- [ ] **Step 2: Remove the import and the JSX**

In `app/(frontend)/layout.tsx`, delete line 1 entirely:

```tsx
import { Analytics } from '@vercel/analytics/next'
```

And replace line 118:

```tsx
        {process.env.NODE_ENV === 'production' && <Analytics />}
```

with nothing — delete the whole line. Leave the surrounding `</div>` and `</body>` untouched.

- [ ] **Step 3: Remove the dependency**

```bash
pnpm remove @vercel/analytics
```

Expected: `package.json` no longer lists `@vercel/analytics`, and `pnpm-lock.yaml` updates.

- [ ] **Step 4: Verify no reference survives**

```bash
grep -rn "vercel/analytics\|<Analytics" --include="*.ts" --include="*.tsx" --include="*.json" . --exclude-dir=node_modules --exclude-dir=.next
```

Expected: no output. If anything prints, the JSX or import was missed and the build will fail with module-not-found (Review Focus #5).

- [ ] **Step 5: Rewrite the privacy policy's analytics paragraph**

In `app/(frontend)/privacy-policy/page.tsx`, inside the section with `id: 'cookies'`, replace this paragraph:

```tsx
        <p>
          We do use a privacy-focused analytics service to count page views and
          see which pages are read. It does not use cookies, does not build a
          profile of you and does not follow you to other websites. It tells us
          that a page was viewed, not who viewed it.
        </p>
```

with:

```tsx
        <p>
          <Term>We run no analytics at all.</Term> No service counts your visit,
          measures which pages you read, or records how you move through the
          site. We know a page was served because our host logs the request, and
          that is the whole of it.
        </p>
```

Leave the first paragraph (no cookies) and the third paragraph (server logs) exactly as they are. `Term` is already imported in this file.

- [ ] **Step 6: Build**

```bash
NODE_ENV=production pnpm build
```

Expected: `✓ Compiled successfully`. A module-not-found error here means Step 2 left JSX behind.

- [ ] **Step 7: Commit**

```bash
git add "app/(frontend)/layout.tsx" "app/(frontend)/privacy-policy/page.tsx" package.json pnpm-lock.yaml
git commit -F - <<'MSG'
fix: remove the analytics that has never worked on this host

@vercel/analytics loads its script from /_vercel/insights/script.js, an
endpoint Vercel serves and AWS Amplify does not. Every page load has been
requesting it and getting a 404, which is the only thing costing the site a
Best Practices point — and far more importantly means no page view has ever
been recorded.

The privacy policy told visitors "we do use a privacy-focused analytics
service to count page views", which was written from the code rather than
from what the code actually does. It now says the site runs no analytics,
which is true and is a stronger position to be in.
MSG
```

---

### Task 2: Fix the ARIA tree in the testimonials

**Files:**
- Modify: `components/testimonials.tsx:140` (star rating div) and `:108` (pause button label)
- Test: headless Lighthouse — `aria-prohibited-attr`, `label-content-name-mismatch` and `agent-accessibility-tree` must all score 1

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks rely on.

- [ ] **Step 1: Confirm both failures reproduce**

Using the chrome-devtools MCP: open `https://gpbuildersgroup.com/` and run `lighthouse_audit` with `device: "mobile"`, `mode: "navigation"`. Read the JSON report.

Expected: `audits["aria-prohibited-attr"].score === 0`, `audits["label-content-name-mismatch"].score === 0`, `audits["agent-accessibility-tree"].score === 0`.

- [ ] **Step 2: Give the star rating a role**

In `components/testimonials.tsx`, replace line 140:

```tsx
              <div className="mt-4 flex gap-0.5" aria-label="5 out of 5 stars">
```

with:

```tsx
              {/* role="img" is what makes aria-label legal here: an aria-label
                  on a bare div names nothing, so the five decorative Star
                  glyphs reached the accessibility tree as five unlabelled
                  nodes and the tree failed validation. */}
              <div className="mt-4 flex gap-0.5" role="img" aria-label="5 out of 5 stars">
```

- [ ] **Step 3: Make the pause button's accessible name contain its visible text**

In `components/testimonials.tsx`, replace line 108:

```tsx
              aria-label={paused ? 'Resume review scrolling' : 'Pause review scrolling'}
```

with:

```tsx
              /* The accessible name must contain the visible text verbatim
                 (WCAG 2.5.3), or a speech-input user saying what they can see
                 does not activate the control. Visible text is
                 "Pause scrolling" / "Resume scrolling". */
              aria-label={paused ? 'Resume scrolling reviews' : 'Pause scrolling reviews'}
```

- [ ] **Step 4: Check the reduced-motion path (Review Focus #2)**

The pause button renders only when `canScroll && !reducedMotion`. Confirm the label change is reachable:

```bash
grep -n "canScroll && !reducedMotion" components/testimonials.tsx
```

Expected: one match at line 105. Then confirm the star rating — which has no such guard — renders unconditionally:

```bash
grep -n 'role="img"' components/testimonials.tsx
```

Expected: one match. The star fix therefore applies in both motion modes; the button fix applies only when motion is allowed, which is correct because the button does not exist otherwise.

- [ ] **Step 5: Build and re-audit**

```bash
NODE_ENV=production pnpm build
NODE_ENV=production pnpm start -p 3111 &
```

Then via chrome-devtools MCP, open `http://localhost:3111/` and run `lighthouse_audit` (`device: "mobile"`, `mode: "navigation"`).

Expected: `aria-prohibited-attr` score 1, `label-content-name-mismatch` score 1, `agent-accessibility-tree` score 1. Stop the server afterwards: `lsof -ti:3111 | xargs kill -9`.

- [ ] **Step 6: Commit**

```bash
git add components/testimonials.tsx
git commit -F - <<'MSG'
fix: repair the accessibility tree in the testimonials

The five-star rating was a bare div carrying an aria-label. An aria-label on
a div with no role names nothing, so the five decorative Star glyphs reached
the accessibility tree as unlabelled nodes and the tree failed validation
outright — which is why Agentic Browsing scored 1 of 2, not just why
Accessibility lost a point. role="img" makes the label legal and collapses
the five glyphs into one named image.

The pause button showed "Pause scrolling" but announced "Pause review
scrolling". WCAG 2.5.3 requires the accessible name to contain the visible
text, so a speech-input user saying what they can read activates what they
meant. "Pause scrolling reviews" contains it and keeps the context.
MSG
```

---

### Task 3: Fix the colour contrast failures

**Files:**
- Create: `scripts/check-contrast.mjs`
- Modify: `components/what-we-do.module.css:66`
- Modify: `components/site-footer.tsx:168,174,192,198`
- Test: `node scripts/check-contrast.mjs`, then headless Lighthouse `color-contrast` must score 1

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `scripts/check-contrast.mjs`, a reusable zero-dependency checker. Task 5 runs it again as part of final verification.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-contrast.mjs`:

```js
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
```

- [ ] **Step 2: Run it against the current values to see it fail**

Temporarily change the two cases to the values the site currently renders — set the nav number cases to `alpha: 0.65` and the footer case to `alpha: 0.45` — then:

```bash
node scripts/check-contrast.mjs
```

Expected: exit code 1, with these lines:

```
FAIL   2.61:1  #8c9596 on #e8eeec  what-we-do nav number, default
FAIL   2.86:1  #709297 on #e8eeec  what-we-do nav number, aria-current="step"
FAIL   3.97:1  #7a7e7e on #1b2122  footer copyright / legal links
```

Those three swatches and ratios must match the Lighthouse measurements in
Audit Evidence (2.6, 2.86, 3.97 — Lighthouse rounds to one decimal). This is
the point of the step: if the checker reproduces the browser's own numbers,
its maths is trustworthy for the fixed values too. If it does not, fix the
checker before going further. Then restore the alphas to `1`, `1` and `0.6`
as written in Step 1.

- [ ] **Step 3: Remove the opacity from the nav number**

In `components/what-we-do.module.css`, replace line 66:

```css
.navigation button > span:first-child { font-size: 10px; opacity: .65; }
```

with:

```css
/* No opacity here. At .65 the number flattened to #8c9596 on #e8eeec — 2.6:1,
   and 2.86:1 in the aria-current state — against a 4.5:1 requirement at 10px.
   The number still reads as secondary through its smaller size; it does not
   need to be faded as well. */
.navigation button > span:first-child { font-size: 10px; }
```

- [ ] **Step 4: Raise the mobile nav font size (Review Focus #3)**

In `components/what-we-do.module.css`, line 92 sets `font-size: 9px` at the mobile breakpoint. 9px is below any reasonable readability floor regardless of contrast. Replace:

```css
  .navigation button { flex: 1; align-items: flex-start; padding-top: 10px; gap: 5px; font-size: 9px; line-height: 1.4; text-align: left; }
```

with:

```css
  /* 9px was unreadable on a phone whatever its contrast. 11px matches the
     desktop size and still fits three labels across a 360px screen. */
  .navigation button { flex: 1; align-items: flex-start; padding-top: 10px; gap: 5px; font-size: 11px; line-height: 1.4; text-align: left; }
```

- [ ] **Step 5: Lighten the footer text**

In `components/site-footer.tsx`, change `text-muted/45` to `text-muted/60` in all four places — lines 168, 174, 192 and 198:

```bash
sed -i '' 's|text-muted/45|text-muted/60|g' components/site-footer.tsx
grep -c "text-muted/60" components/site-footer.tsx
```

Expected: `4`. Then confirm none remain:

```bash
grep -c "text-muted/45" components/site-footer.tsx || echo "0 remaining — correct"
```

- [ ] **Step 6: Check the hover state (Review Focus #4)**

The legal links use `hover:text-accent`, which Lighthouse never measures because it only audits the resting state. Confirm `--accent: #8fc0c7` on `--dark-bg-deep: #1b2122`:

```bash
node -e '
const hex=h=>{const v=h.replace("#","");return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16))}
const lum=rgb=>{const[r,g,b]=rgb.map(c=>{const s=c/255;return s<=0.03928?s/12.92:((s+0.055)/1.055)**2.4});return 0.2126*r+0.7152*g+0.0722*b}
const ratio=(a,b)=>{const[l1,l2]=[lum(a),lum(b)].sort((x,y)=>y-x);return (l1+0.05)/(l2+0.05)}
console.log("accent on dark-bg-deep:", ratio(hex("#8fc0c7"),hex("#1b2122")).toFixed(2)+":1")'
```

Expected: **8.18:1**. This has been computed ahead of time and passes
comfortably, so the hover state needs no change — the step exists to record
that it was checked rather than assumed. If the number differs, the accent
token has moved since this plan was written; do not change it unilaterally,
as it is used site-wide. Raise it with the user.

- [ ] **Step 7: Run the checker — it should now pass**

```bash
node scripts/check-contrast.mjs
```

Expected: exit code 0, and

```
PASS   5.10:1  #5b6567 on #e8eeec  what-we-do nav number, default
PASS   5.89:1  #2f6169 on #e8eeec  what-we-do nav number, aria-current="step"
PASS   5.10:1  #5b6567 on #e8eeec  what-we-do nav label
PASS   5.96:1  #9a9d9c on #1b2122  footer copyright / legal links

4/4 pass at 4.5:1 (WCAG AA, normal text)
```

These four values have been computed ahead of time and are what the script
must print. A different number means the tokens have moved since this plan
was written — reconcile against `globals.css` before assuming the script is
wrong.

- [ ] **Step 8: Build and re-audit**

```bash
NODE_ENV=production pnpm build
NODE_ENV=production pnpm start -p 3111 &
```

Via chrome-devtools MCP, open `http://localhost:3111/` and run `lighthouse_audit` (`device: "mobile"`, `mode: "navigation"`).

Expected: `audits["color-contrast"].score === 1`. Stop the server: `lsof -ti:3111 | xargs kill -9`.

- [ ] **Step 9: Commit**

```bash
git add scripts/check-contrast.mjs components/what-we-do.module.css components/site-footer.tsx
git commit -F - <<'MSG'
fix: bring the nav numbers and footer text up to AA contrast

Three failures, two causes.

The chapter numbers in the What We Do navigation carried opacity .65, which
flattened them to #8c9596 on #e8eeec — 2.6:1, and 2.86:1 in the
aria-current state — where 10px text needs 4.5:1. Dropping the opacity gives
5.1:1 and 5.89:1. The number still reads as secondary through its size; it
did not need to be faded as well. The mobile breakpoint's 9px went to 11px
at the same time, since 9px is unreadable whatever its contrast.

The footer copyright and legal links were text-muted/45, which renders
#7a7e7e on #1b2122 — 3.97:1. /60 gives 5.96:1. I introduced half of this
myself when the Privacy and Terms links were added: they matched the
copyright line beside them, so an existing failure was extended rather than
noticed.

scripts/check-contrast.mjs computes these ratios from the design tokens so
the next change to them fails loudly. It uses Node built-ins only; this repo
has no test runner and contrast is arithmetic, so it needs no browser.
MSG
```

---

### Task 4: Fix the carousel indicator touch targets

**Files:**
- Modify: `components/hero.tsx:204` (the indicator container)
- Test: headless Lighthouse — `target-size` must score 1

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing later tasks rely on.

- [ ] **Step 1: Understand the geometry before changing it**

The dot is `w-2 h-2` (8px). The button is `-m-2 p-2`: 8px padding each side gives a 24×24px hit area, and the −8px margin pulls the *layout* box back to 8×8 so the dots sit tight. The container's `gap-2` (8px) therefore places dot centres 8 + 8 = **16px** apart, while each hit area is 24px wide — so adjacent hit areas overlap by 8px. Lighthouse reports the usable region as 16×24.

WCAG 2.5.8 is satisfied when a 24px circle centred on each target does not intersect another target's circle — that is, when centres are **≥ 24px apart**. The fix is spacing, not size.

- [ ] **Step 2: Widen the gap**

In `components/hero.tsx`, replace line 204:

```tsx
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
```

with:

```tsx
      {/* gap-5 (20px), not gap-2. Each button is a 24px hit area (-m-2 p-2
          around an 8px dot) but the negative margin collapses its layout box
          back to 8px, so at gap-2 the centres sat 16px apart and the hit areas
          overlapped — WCAG 2.5.8 wants 24px clear. 20px of gap puts the
          centres 28px apart. The dots themselves are unchanged. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-5">
```

- [ ] **Step 3: Verify the arithmetic**

Dot centres are now `8px (dot) + 20px (gap)` = **28px** apart, against a 24px requirement. Confirm nothing else changed:

```bash
grep -n 'className="group -m-2 p-2"' components/hero.tsx
grep -n 'className="block w-2 h-2 rounded-full' components/hero.tsx
```

Expected: one match each — the button padding and the dot size must both be untouched, because the fix is spacing alone.

- [ ] **Step 4: Build and re-audit**

```bash
NODE_ENV=production pnpm build
NODE_ENV=production pnpm start -p 3111 &
```

Via chrome-devtools MCP, open `http://localhost:3111/` and run `lighthouse_audit` (`device: "mobile"`, `mode: "navigation"`).

Expected: `audits["target-size"].score === 1`. Stop the server: `lsof -ti:3111 | xargs kill -9`.

- [ ] **Step 5: Visually confirm the dots still read as a group**

Via chrome-devtools MCP, resize the page to 400×860 and screenshot the hero. The indicator dots should still read as one row of related controls, not as scattered marks. If 20px looks too loose, `gap-4` (16px) gives centres exactly 24px apart — the minimum — and is the fallback; anything below that reintroduces the failure.

- [ ] **Step 6: Commit**

```bash
git add components/hero.tsx
git commit -F - <<'MSG'
fix: stop the carousel dots overlapping each other's touch targets

Each indicator button already had a 24px hit area — 8px dot, 8px padding
each side — but -m-2 collapsed its layout box back to 8px, so gap-2 placed
the dot centres 16px apart and the hit areas overlapped by 8px. Lighthouse
measured the usable region as 16x24 against a 24x24 minimum.

gap-5 puts the centres 28px apart, clear of the 24px WCAG 2.5.8 needs. The
dots and their padding are untouched: the problem was spacing, not size.
MSG
```

---

### Task 5: Verify the whole branch and deploy

**Files:**
- Modify: none
- Test: full headless Lighthouse audit, contrast checker, live-site checks after deploy

**Interfaces:**
- Consumes: all four previous tasks must be committed.
- Produces: the deployed, verified result.

- [ ] **Step 1: Confirm a clean tree and the expected commits**

```bash
git status --short
git log --oneline -5
```

Expected: empty status, and four new commits above `9ee16b2`.

- [ ] **Step 2: Confirm no commit carries an attribution trailer**

```bash
git log -4 --format='%b' | grep -ciE "co-authored-by|claude-session"
```

Expected: `0`. If non-zero, the standing user rule was broken — amend before pushing.

- [ ] **Step 3: Run both verification mechanisms together**

```bash
node scripts/check-contrast.mjs
NODE_ENV=production pnpm build
NODE_ENV=production pnpm start -p 3111 &
```

Via chrome-devtools MCP: open `http://localhost:3111/`, run `lighthouse_audit` (`device: "mobile"`, `mode: "navigation"`), and read the JSON report.

Expected, all in one run:

| Audit | Score |
|---|---|
| `aria-prohibited-attr` | 1 |
| `color-contrast` | 1 |
| `target-size` | 1 |
| `label-content-name-mismatch` | 1 |
| `errors-in-console` | 1 |
| `agent-accessibility-tree` | 1 |

and category scores: Accessibility **100**, Best Practices **100**, SEO **100**, Agentic Browsing **100**.

Stop the server: `lsof -ti:3111 | xargs kill -9`.

If any audit is still 0, go back to the task that owns it rather than patching here.

- [ ] **Step 4: Push**

```bash
git push client main
git push origin main
```

Both remotes must end at the same SHA as local. Confirm:

```bash
for r in client origin; do echo "$r $(git rev-parse --short $r/main)"; done
git rev-parse --short HEAD
```

- [ ] **Step 5: Verify on the live site once Amplify has deployed**

```bash
curl -s -o /dev/null -w "vercel script: %{http_code}\n" https://gpbuildersgroup.com/_vercel/insights/script.js
curl -s https://gpbuildersgroup.com/ | grep -c "_vercel" || echo "0 references — correct"
curl -s https://gpbuildersgroup.com/privacy-policy | grep -c "privacy-focused analytics service" || echo "0 — old wording gone"
```

Expected: the script URL still 404s (nothing serves it) but **nothing requests it**, so the page has zero `_vercel` references and the console error is gone. The old privacy wording must be absent.

- [ ] **Step 6: Re-audit the live site**

Via chrome-devtools MCP, open `https://gpbuildersgroup.com/` and run `lighthouse_audit` (`device: "mobile"`, `mode: "navigation"`).

Expected: Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100. Report the before/after to the user.
