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

### Phase 8 — Database + admin (libSQL-backed works + footer gear admin) · ✅
- [x] SSG → SSR (`nuxt build`; `netlify.toml` uses `npm run build`, Nitro `netlify` preset).
- [x] libSQL data layer (`server/utils/db.ts`): Turso `libsql://` (prod) / local `file:` (dev); auto-creates the DB dir.
- [x] Tables + seed: `portfolio_items` (title/url/thumbnail/kind/sort_order), `admin_users`, `contact_inquiries` — seeded from the old hardcoded arrays.
- [x] Public `GET /api/works` → `useWorks()` feeds `OWorksSection` (was hardcoded).
- [x] Admin auth: bcrypt + h3 signed session (`NUXT_ADMIN_SECRET`), per-username lockout, `requireAdmin` guard.
- [x] Admin UI: footer gear icon → `/admin/login` → `layouts/admin.vue` + `OAdminItems` CRUD + inquiries list.
- [x] Contact form → real `POST /api/contact` (was a silent no-op).
- [x] Toast system (`stores/toast.ts` + `OToast`/`MToast`) for loud error visibility.
- **Verify:** `npm run build` clean; runtime smoke test passed (seed 4 live + 12 templates → session 401 → login ok).

### Phase 9 — Admin thumbnail upload (public/uploads + path in DB) · ✅
- [x] `POST /api/admin/upload` — multipart → `public/uploads/` (png/jpg/webp/svg/gif, ≤2MB), returns `/uploads/<name>`.
- [x] `server/routes/uploads/[...path].get.ts` — serves runtime uploads (Nitro only serves build-time `public/`), with path-traversal guard.
- [x] `OAdminItems` — file input (upload → auto-fill `thumbnail` path) + live preview; path persists to `portfolio_items.thumbnail`.
- [x] `public/uploads/` gitignored (user data, not source).
- **Verify:** `npm run build` clean; smoke test (login → upload → 200 image/png → traversal 404) passed.

## Verify
- `npm run test:unit` (Vitest) + `npm run test:e2e` (Playwright) — add if the test dirs are missing.
- `npm run build` — clean SSR output (was `generate`/SSG).
- Runtime smoke: `node .output/server/index.mjs` → `/api/works`, `/api/admin/session`, login.
- Flip `[ ]` → `[x]` as each phase lands.
