# shiro-portfolio — BUILD_PLAN

> Living plan. EXTEND with status checkpoints + deltas; never rewrite from scratch.

## Baseline (already present)
- [x] Nuxt 4 SSG + modules (Pinia, i18n, PWA, security, SEO, Tailwind v4)
- [x] M3 token pipeline (`scripts/generate-theme.mjs` → `material-tokens.css`)
- [x] 3 locales (en/es/am) with translations
- [x] M3 atomic component scaffold (7 atoms, 2 molecules, 8 organisms)
- [x] Dark mode (Pinia + cookie)
- [x] Deployed to Netlify (`shiro-portfolio-sh1r00.netlify.app`)

## ⚠️ Drift — cleanup deltas

### Phase 1 — Atomic refactor (wire the organisms into the page) · ✅
- [x] `index.vue` is now a thin composer of `OHeroSection`, `OStatsSection`, `OSkillsSection`,
      `OWorksSection`, `OScreenshotsCarousel`, `OAboutSection`, `OContactSection`.
- [x] `MLanguageSwitcher` (defined) used — via `ONavbar`.
- [x] `MProjectCard` (defined) used — via `OWorksSection`.

### Phase 2 — Wire up i18n (remove hardcoded English) · ✅
- [x] All strings now `$t()`-driven through the organisms.
- [x] `<html lang>` driven dynamically from `locale` (in `index.vue` `useHead`).
- [x] Drift reconciled: organisms use the 8 canonical skills matching `en.json`.

### Phase 3 — i18n config safety · ✅
- [x] `detectBrowserLanguage: false` (removed the `alwaysRedirect: false` landmine).
- [x] `trailingSlash` left at Nuxt 4 default (`true`).

### Phase 4 — Missing contact section · ✅
- [x] `OContactSection` wired into `index.vue`; `contact.*` keys present in en/es/am.

### Phase 5 — SEO
- [ ] Add `useLocaleHead({ seo: true })` for per-locale `canonical` + `hreflang`.

### Phase 6 — Content as data
- [ ] Extract skills/templates/projects/screenshots arrays into a single content module (or Nuxt Content).

### Phase 7 — Full atom composition (in progress)
- [x] `MProjectCard` → `AImage` + `ABadge`; `OStatsSection`/`OSkillsSection` → `ACard`;
      `OContactSection`/`OHeroSection`/`OAboutSection` → `AButton`.
- [ ] Convert headings/paragraphs to `AText` and emoji to `AIcon` (visual-regression risk — do carefully).

## Verify
- `npm run test:unit` (Vitest) + `npm run test:e2e` (Playwright) — add if the test dirs are missing.
- `npm run generate` — clean SSG output for `/`, `/es/`, `/am/`.
- Flip `[ ]` → `[x]` as each phase lands.
