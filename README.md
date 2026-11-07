# SH1R00 Portfolio

*shiro — where style meets function*

A single-page portfolio for **shiro** (sh1r00), a solo full-stack developer. It showcases
skills, live production apps, and reusable templates — each backed by a long-form
**case study** — and it is editable end-to-end through a password-protected admin panel.

Live at **[shiro-portfolio-nuxt4.rasisg.workers.dev](https://shiro-portfolio-nuxt4.rasisg.workers.dev)**.

---

## What it is

A full-stack developer portfolio that is also its own content-management system:

- **Hero** — kinetic headline, aurora/spotlight/tilt/parallax effects, selected-work collage.
- **Stats strip** — project / template / live / language counts, computed from the database (never hardcoded).
- **Works** — live projects (featured card + grid) and a collapsible templates grid, both fed from the DB.
- **Case studies** — seven long-form blog posts (`/blog/[slug]`) with code snippets, rendered from `app/data/`.
- **Screenshots carousel** — a11y-complete carousel (reduced-motion aware).
- **Skills / About / Contact** — M3 cards; the About bio and contact info are DB-backed and admin-editable.
- **Admin panel** — `/admin/login` → CRUD for works, inquiries inbox, and site content, with bcrypt sessions and per-username lockout.

## Architecture

| Concern | Implementation |
|---|---|
| Framework | Nuxt 4 (`cloudflare_module` Nitro preset — SSR on Cloudflare Workers) |
| UI | Vue 3 + Tailwind v4 + M3 tokens (`scripts/generate-theme.mjs` → `app/assets/css/material-tokens.css`) |
| Component model | M3 atomic design, bottom-up: atoms (`A*`) → molecules (`M*`) → organisms (`O*`) → page |
| i18n | `@nuxtjs/i18n` — **en / es / am**, `prefix_except_default`, `detectBrowserLanguage: false`, lockstep locales |
| PWA | `@vite-pwa/nuxt` (autoUpdate, offline-first static assets) |
| Security | `nuxt-security` (CSP + headers; `xssValidator`/`csrf` off — see Pitfalls) |
| SEO | `@nuxtjs/seo` (sitemap, robots, llms.txt) + `useLocaleHead({ seo: true })` |
| Database | Turso / libSQL (`@libsql/client`) — `libsql://` in prod, `file:` in Node dev |
| Auth | bcrypt password hashing + h3 signed session (`NUXT_ADMIN_SECRET`) |
| Media uploads | Cloudflare R2 (S3-compatible) in prod; local `public/uploads/` fallback in dev |
| Deploy | `wrangler` → Cloudflare Workers (`npm run deploy`); legacy `netlify.toml` kept for reference |

> **SSG vs SSR note:** the production build is **SSR** (Nitro `cloudflare_module` preset,
> so works data and admin are runtime-editable). `npm run generate` also succeeds and emits
> a static `.output/public` you can host anywhere — but the DB-backed sections will only
> populate when the Worker is running.

## The works / case-studies data model

**Works** live in the database (table `portfolio_items`), seeded on first boot from
`server/utils/database-init.ts`:

```
portfolio_items(id, title, url, thumbnail, kind ['live'|'template'], sort_order)
admin_users(id, username, password_hash, failed_attempts, locked_until)
contact_inquiries(id, name, email, message, created_at)
site_content(key PRIMARY KEY, value)      -- about_bio, contact_email, contact_phone, contact_location
```

Public read path: `GET /api/works` → `useWorks()` composable → `OWorksSection` /
`OStatsSection` / `OAboutSection`.

**Case studies** live in code (not the DB):

- `app/data/caseStudies.ts` — structured metadata: `slug`, `title`, `url`, `host`, `stack`,
  `summary`, `baseStart`, `weaknesses[]`, `fixes[]`, `problems[{problem, fix}]`, `lessons[]`.
- `app/data/caseStudyBodies.ts` — long-form markdown bodies (rendered by
  `app/utils/renderMarkdown.ts` — headings, paragraphs, code blocks, bold, links, lists).
- Rendered at `/blog/[slug]` and indexed at `/blog`; the Works section links to them.

There are **7** case studies (`kphone-marketing`, `shop-tulu`, `credit-wiz`,
`money-conversion`, `mehari-global`, `skilled-trades`, `dice-arena`) — one per live project.

## Quick start

```bash
npm install
cp .env.example .env            # fill NUXT_ADMIN_SECRET (32+ chars), optional TURSO_*/R2_*
npm run dev                     # local: falls back to server/data/portfolio.db (file:)
```

Local Node development needs **no** Turso or R2 credentials — the DB falls back to
`file:` and uploads fall back to `public/uploads/`. Production (Workers) requires the
secrets described below.

## Build & deploy

```bash
npm run test:unit    # Vitest — i18n-lockstep + more
npm run test:e2e     # Playwright — login → dashboard CRUD smoke
npm run typecheck    # nuxi prepare + tsc (server project)
npm run generate     # SSG output → .output/public (for any static host)
npm run deploy       # build + wrangler deploy → Cloudflare Workers (SSR)
```

Production Workers secrets (set via `wrangler secret put` or the dashboard):

- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` — the production DB.
- `NUXT_ADMIN_SECRET` (32+ random chars), `NUXT_ADMIN_USERNAME`, `NUXT_ADMIN_PASSWORD`
  — seeded admin (created on first boot, bcrypt-hashed, never overwritten).
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`
  — admin image uploads; without them the upload API returns HTTP 503 (never writes to
  the ephemeral Worker disk).

## Pitfalls & fixes

These are the bugs that actually bit this repo — each has the fix baked into the code:

- **PWA blank screen (`non-precached-url`)** — SSR has no precached `index.html`.
  Fix: `workbox.navigateFallback: null` and drop `html` from `globPatterns`.
- **Blank screen, no console errors** — missing `components: [{ path: '~/components', pathPrefix: false }]`
  made every organism auto-import as `OrganismsOHeroSection` and render empty.
- **`_ctx.localePath is not a function`** — `localePath` is not auto-imported; use `const localePath = useLocalePath()`.
- **`props is not defined`** — `AButton` used `props.href` without `const props = defineProps()`.
- **Infinite redirect on `/es/` `/am/`** — `detectBrowserLanguage` truthy + hand-added
  `/es → /es/` redirects. Fix: `detectBrowserLanguage: false`, no redirect routeRules.
- **hreflang missing** — config alone emits nothing; merge `useLocaleHead({ seo: true })`.
- **POST bodies crash (`escapeHtml` TypeError)** — `nuxt-security` `xssValidator` breaks
  POSTs; inputs are validated server-side instead, so `xssValidator: false`.
- **CSRF** — disabled deliberately: the admin session cookie is `SameSite=lax`, which
  blocks cross-site POST (the primary CSRF vector for a single-user admin).
- **libsql native binding on Workers** — `nitro.externals.external: ['@libsql/client', 'libsql']`.
- **Split-stack deps (`bcryptjs` missing on Render)** — backend deps live in the
  `hapi-server` sub-package, not the root manifest (see the kPhone case study).
- **nuxt-security@2.6.0** needs Node ≥ 24 → `.node-version` / `NODE_VERSION = "24"`.
- **turso/libSQL on Workers** — Workers have no durable local filesystem; configure
  `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`, or the local `file:` fallback is Node-only.

## Documentation

See [DOCUMENTATION.md](DOCUMENTATION.md) for the full step-by-step history, the
data-model details, and the deployment/dead-end write-ups. Open work and known
inconsistencies are tracked in [TODO.md](TODO.md).
