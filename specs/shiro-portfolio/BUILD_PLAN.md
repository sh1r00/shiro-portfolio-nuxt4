# shiro-portfolio — BUILD_PLAN

> Living plan. EXTEND with status checkpoints + deltas; never rewrite from scratch.

## Baseline (already present)
- [x] Nuxt 4 SSG + modules (Pinia, i18n, PWA, security, SEO, Tailwind v4)
- [x] M3 token pipeline (`scripts/generate-theme.mjs` → `material-tokens.css`)
- [x] 3 locales (en/es/am) with translations
- [x] M3 atomic component scaffold (7 atoms, 2 molecules, 8 organisms)
- [x] Dark mode (Pinia + cookie)
- [x] Deployed to Netlify (`shiro-portfolio-sh1r00.netlify.app`)

## ⚠️ Drift — cleanup deltas (highest priority)

The scaffold exists but the page has drifted from it. Fix in this order:

### Phase 1 — Atomic refactor (wire the organisms into the page)
- [ ] `index.vue` inlines ALL section markup (header, hero, skills, live, templates,
      preview, about, footer) while `ONavbar`, `OHeroSection`, `OSkillsSection`,
      `OWorksSection`, `OScreenshotsCarousel`, `OStatsSection`, `OContactSection`,
      `OFooter` are defined but **unused**. Refactor: move each section's markup + data
      into its organism; `index.vue` becomes a thin composer of `<O… />`.
- [ ] Use `MLanguageSwitcher` (defined) instead of the raw `<select v-model="locale">`.
- [ ] Use `MProjectCard` (defined) for template/live cards.

### Phase 2 — Wire up i18n (remove hardcoded English)
- [ ] `index.vue` is hardcoded English; the `useHead` hardcodes `lang: 'en'`. Replace
      every string with `$t('…')` keys from `en.json` (and add missing keys to es/am).
- [ ] Drive `<html lang>` dynamically (`useHead(() => ({ htmlAttrs: { lang: locale.value } }))`),
      not a hardcoded `'en'`.
- [ ] Reconcile drift: the page has 12 skills; `en.json` has 8. Pick one source of truth.

### Phase 3 — i18n config safety
- [ ] `nuxt.config.ts` has `detectBrowserLanguage: { alwaysRedirect: false, useCookie: true }`
      — the `alwaysRedirect: false` landmine (redirect loop). Change to `detectBrowserLanguage: false`.
- [ ] Ensure `trailingSlash: true` (default) so `switchLocalePath` emits `/es/`.

### Phase 4 — Missing contact section
- [ ] `OContactSection` is defined but there's no contact section on the page. Add it
      (name/email/message + `mailto:`) and wire `contact.*` i18n keys.

### Phase 5 — SEO
- [ ] Add `useLocaleHead({ seo: true })` for per-locale `canonical` + `hreflang`.

### Phase 6 — Content as data
- [ ] Extract the hardcoded `skills` / `templates` / `liveProjects` / `screenshots` arrays
      out of the page into a single content module (or Nuxt Content) so they're reusable
      and i18n-able.

## Verify
- `npm run test:unit` (Vitest) + `npm run test:e2e` (Playwright) — add if the test dirs are missing.
- `npm run generate` — clean SSG output for `/`, `/es/`, `/am/`.
- Flip `[ ]` → `[x]` as each phase lands.
