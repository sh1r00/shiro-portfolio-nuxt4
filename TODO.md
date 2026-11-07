# TODO — spoofed / placeholder / conflicting data

> Living list of every number, screenshot, and DB record that is not yet backed by a
> verified source of truth. Anything here is either (a) placeholder content that must
> be replaced with real data, or (b) a known inconsistency between the code, the seed,
> and the production Turso database.

## 1. Conflicting project counts (highest priority)

The site reports the project count in several places, and the numbers do **not** agree
with each other or with the code's own source of truth (`server/utils/database-init.ts`
SEED, which now contains **8 live + 12 templates = 20**). Reported on the deployed site:

| Where | Reported value | Source of truth in code |
|---|---|---|
| `<meta>` / head description | "16+" projects | dynamic — `OStatsSection`/`OAboutSection` compute from `/api/works` |
| Stats strip (`OStatsSection`) | "16+ / 4 live" | now dynamic: `live + templates`, `templates`, `live`, `3` languages |
| Skills / somewhere | "19 projects" | no hardcoded number in code today |
| About (`OAboutSection`) | "19" projects | now dynamic: `live + templates` |
| Works grid | 7 live projects shown | SEED has 8 `kind: 'live'`; 7 of them have case studies |

The code is already **dynamic** (counts are computed from `/api/works`, which reads
`portfolio_items`), so after a fresh seed the strip will read **20 / 12 / 8 / 3**.
The stale "16+ / 4 / 19" figures live in the **production Turso database**, which has
drifted from the seed and which this task did **not** touch.

**Action:** reconcile the production `portfolio_items` table against the SEED (or
accept the dynamic counts and stop advertising hardcoded numbers in meta/copy), then
delete every hardcoded count so the only number shown is the computed one.

## 2. Placeholder / broken thumbnails

Fixed in code (seed now references real assets) but **not yet reflected in production DB**:

- `server/utils/database-init.ts` SEED had **12 empty `thumbnail` strings**. They now
  reference the real 1280×800 PNGs in `public/img/` (see the diff). These only take
  effect on a **fresh database init** — the existing production DB still has empty/stale
  thumbnails until re-seeded or updated via `scripts/update-*.mjs`.
- `SH1R00 Portfolio` had no image; added a branded **SVG preview card** at
  `public/img/shiro-portfolio.svg` (project name + host + tagline + monogram — no fake stats).
- `Yack-Shack` still references an **external** URL
  (`https://yack-shack.pages.dev/icons/yak-banner.svg`). It is a remote dependency that
  will break if that host changes path. **Consider vendoring a local copy** into
  `public/img/` and pointing the seed at it.
- **Stale seed URLs**: many `portfolio_items.url` values are old `*.netlify.app` URLs,
  while `app/data/caseStudies.ts` and `scripts/capture-*.mjs` use the current
  `*.pages.dev` / `*.workers.dev` / `*.vercel.app` / `*.onrender.com` URLs (e.g.
  `shop-tulu.netlify.app` vs `shop-tulu.pages.dev`, `marketing-campaign-gen.netlify.app`
  vs `marketing-gen.pages.dev`). **Action:** determine the canonical host for each project
  and align the seed, case studies, and capture scripts to it.

## 3. Case-study vs works-grid mismatches

- `app/data/caseStudies.ts` has **7** case studies, all "live" projects.
- The SEED has **8** `kind: 'live'` entries. The extra two are `SH1R00 Portfolio`
  (the site itself — fine) and `Yack-Shack` (no case study).
- `Dice Arena` is a case study **and** is shown via `MProjectSpotlight` (deployment
  case study), but it is **not** in the `portfolio_items` seed — it appears in the
  spotlight only. Decide whether Dice Arena belongs in the works grid as a regular card.

## 4. Blog chrome is hardcoded English

`app/pages/blog/[slug].vue` and `app/pages/blog/index.vue` contain hardcoded English UI
strings ("CASE STUDY", "Weaknesses", "Fixes", "Lessons", "More case studies", "Not found",
"Read the case study", "← Back to works"). This violates the i18n-lockstep convention
(never hardcode English). The case-study **bodies** are long-form English content (fine),
but the page **chrome** should move to `i18n/locales/{en,es,am}.json`. The `i18n-lockstep`
unit test only checks the three locale files against each other, so it will not catch
hardcoded strings in components.

## 5. Case-study bodies contain no images (by design)

`app/utils/renderMarkdown.ts` does not render `![alt](path)` image syntax (it only
handles headings, paragraphs, code, bold, links, and lists). The long-form bodies
therefore contain **no** image markdown to avoid broken `<img>` references. If images
are wanted in the bodies, extend the renderer with an `<img>` branch first, then add
real `public/img/*.png` paths.
