# SH1R00 Portfolio — Documentation

## Overview

**shiro** (sh1r00) is a single-page full-stack developer portfolio that is also its own
content-management system. It lists live projects + reusable templates (both editable
from an admin panel), an About section with a DB-backed bio, a Contact page (mailto +
form), an admin dashboard, and **per-project case studies** rendered as long-form blog
posts. i18n (en/es/am), PWA, M3 dark mode.

Live: **https://shiro-portfolio-nuxt4.rasisg.workers.dev**

## Functionality

- **Hero** — kinetic headline + interactive effects (spotlight, tilt, parallax, aurora).
- **Stats / Works** — DB-driven counts and project cards (featured live project + grid, templates in a `<details>`).
- **Case studies** — `/blog` index + `/blog/[slug]` long-form posts with code snippets.
- **Screenshots carousel** — a11y-complete, reduced-motion aware.
- **Skills / About / Contact** — M3 cards; About bio + contact info are DB-backed and admin-editable.
- **Admin panel** — `/admin/login` → works CRUD, inquiries inbox, site-content editor, image upload.

## Stack

Nuxt 4 (SSR on Cloudflare Workers) · Vue 3 · Tailwind v4 · `@nuxtjs/i18n` · `@vite-pwa/nuxt`
· `nuxt-security` · `@nuxtjs/seo` · Pinia · `@libsql/client` (Turso) · `bcryptjs` ·
`@aws-sdk/client-s3` (Cloudflare R2) · `@material/material-color-utilities` (M3 tokens).

## Architecture

### Component model (M3 atomic, bottom-up)

`app/components/{atoms,molecules,organisms}` — atoms (`AButton`, `ACard`, `AImage`,
`AIcon`, `ALink`, `ABadge`, `AText`), molecules (`MProjectCard`, `MProjectSpotlight`,
`MMarquee`, `MLanguageSwitcher`, `MToast`), organisms (`OHeroSection`, `OStatsSection`,
`OWorksSection`, `OCaseStudiesSection`, `OScreenshotsCarousel`, `OSkillsSection`,
`OAboutSection`, `OContactSection`, `ONavbar`, `OFooter`, `OAdminItems`,
`OAdminContent`, `OToast`). Pages compose organisms only — no inline section markup.
`components: [{ path: '~/components', pathPrefix: false }]` is **required** so organisms
auto-import by filename (not `OrganismsOHeroSection`).

### i18n (en / es / am)

Three locale files in `i18n/locales/{en,es,am}.json`, kept in **lockstep** (enforced by
`tests/unit/i18n-lockstep.test.ts`). `strategy: 'prefix_except_default'`,
`defaultLocale: 'en'`, `detectBrowserLanguage: false`, `lazy: true`.
`useLocaleHead({ seo: true })` in `index.vue` emits per-locale `canonical` + `hreflang`.

### Database (Turso / libSQL)

- Prod: `libsql://<db>-<org>.turso.io` + auth token (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`).
- Dev: local `file:` at `server/data/portfolio.db` (auto-created; no creds needed).
- `nitro.externals.external: ['@libsql/client', 'libsql']` — don't bundle the native binding.

Tables (seeded on first boot from `server/utils/database-init.ts`):

```
portfolio_items(id, title, url, thumbnail, kind, sort_order)   -- 8 live + 12 templates
admin_users(id, username, password_hash, failed_attempts, locked_until)
contact_inquiries(id, name, email, message, created_at)
site_content(key PRIMARY KEY, value)                            -- about_bio, contact_*
```

### Admin auth & security

- bcrypt (`cost 12`) password hashing; seeded admin created on first boot from
  `NUXT_ADMIN_USERNAME`/`NUXT_ADMIN_PASSWORD` (never overwritten).
- h3 signed session via `NUXT_ADMIN_SECRET`; `requireAdmin` middleware guards `/api/admin/*`.
- Per-username lockout (`failed_attempts` / `locked_until`).
- `nuxt-security`: `xssValidator: false` (it breaks POST bodies — inputs are validated
  server-side instead) and `csrf: false` (the admin session cookie is `SameSite=lax`,
  which blocks cross-site POST).

### Media uploads (R2 + local fallback)

`POST /api/admin/upload` → Cloudflare R2 when `R2_*` env is set (durable on Workers);
otherwise local `public/` fallback. Magic-number validation (rejects renamed/polyglot
files); SVG disallowed (XSS). Without `R2_*` on Workers the upload API returns HTTP 503
and never writes to the ephemeral Worker disk. Runtime uploads are served by
`server/routes/uploads/[...path].get.ts` (Nitro only serves build-time `public/`), with a
path-traversal guard. `public/uploads/` is gitignored (user data, not source).

## Case studies data model

Two files, two roles:

1. **`app/data/caseStudies.ts`** — structured metadata per project: `slug`, `title`,
   `url`, `host`, `stack`, `summary`, `baseStart`, `weaknesses[]`, `fixes[]`,
   `problems[{problem, fix}]`, `lessons[]`. This drives the `/blog` index, the case-study
   cards, and the `Weaknesses` / `Fixes` / `Problems & how they were fixed` / `Lessons`
   sections on each post.
2. **`app/data/caseStudyBodies.ts`** — long-form markdown bodies (`Record<string, string>`)
   rendered by `app/utils/renderMarkdown.ts` (headings, paragraphs, fenced code, inline
   code, bold, links, unordered lists — no images by design). Each body is a full blog
   post: narrative intro, context, 2–4 technical sections with code, a "what I'd do
   differently" reflection, and key takeaways.

The 7 slugs: `kphone-marketing`, `shop-tulu`, `credit-wiz`, `money-conversion`,
`mehari-global`, `skilled-trades`, `dice-arena` (one per live project).

## Steps taken (history)

- Migrated SSG → SSR so works data + admin are runtime-editable.
- libSQL/Turso backend (`file:` in dev, `libsql://` in prod).
- Admin panel: bcrypt + h3 signed session + `requireAdmin` middleware.
- R2 thumbnail uploads (magic-number validation, SVG disallowed).
- Contact form + Contact page with mailto drawn from the DB.
- `site_content` key-value table for About bio + Contact info, editable in admin. The
  editable bio is shown in English; Spanish and Amharic use their translated catalog copy.
- Admin credential rotation (username `sh1r00`).
- Case studies as blog posts (code snippets) + fresh screenshots.
- Real screenshots for the 7 live projects + 12 templates via `scripts/capture-*.mjs`
  (Playwright + system Edge), thumbnails set via `scripts/update-*.mjs`.

## Screenshots & thumbnails pipeline

- **Capture:** `scripts/capture-screenshots.mjs` (7 live projects) and
  `scripts/capture-templates.mjs` (12 templates) drive Playwright against the system
  Edge browser, writing 1280×800 PNGs into `public/img/`.
- **Wire-up:** `scripts/update-thumbnails.mjs` (live) and
  `scripts/update-template-thumbnails.mjs` (templates) update `portfolio_items.thumbnail`
  in Turso against host matches.
- **Seed:** `server/utils/database-init.ts` now references a real thumbnail for every one
  of the 20 seed entries (see the diff); `SH1R00 Portfolio` uses a branded SVG preview
  card at `public/img/shiro-portfolio.svg`. `Yack-Shack` still points at an external
  `*.pages.dev` SVG (flagging in TODO).

## Pitfalls & fixes

- **PWA blank screen (`non-precached-url`)** — SSR has no precached index.html. Fix:
  `workbox.navigateFallback: null` + drop `html` from `globPatterns`.
- **Blank screen, no console errors** — missing `components: [{ path: '~/components', pathPrefix: false }]`
  made every organism auto-import as `OrganismsOHeroSection` and render empty.
- **`_ctx.localePath is not a function`** — `localePath` is not auto-imported; use `const localePath = useLocalePath()`.
- **`props is not defined`** — `AButton` used `props.href` without `const props = defineProps()`.
- **Infinite redirect on `/es/` `/am/`** — `detectBrowserLanguage` truthy + hand-added
  `/es → /es/` redirects. Fix: `detectBrowserLanguage: false`, no redirect routeRules.
- **hreflang missing** — config alone emits nothing; merge `useLocaleHead({ seo: true })`.
- **POST bodies crash (`escapeHtml` TypeError)** — `nuxt-security` `xssValidator` breaks
  POSTs; inputs are validated server-side instead, so `xssValidator: false`.
- **Production database** — Workers have no durable local filesystem. Configure
  `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; the local `file:` fallback is only for Node development.
- **nuxt-security@2.6.0** needs Node ≥24 → `NODE_VERSION = "24"`.
- **M3 token trap** — `tailwind-material-colors` (used by sibling projects) bakes static
  colors; there is no runtime `--color-primary-container` variable. This portfolio uses
  its own `--md-sys-color-*` tokens generated by `scripts/generate-theme.mjs`.

## Deployment

Production runs on **Cloudflare Workers** using Nitro's `cloudflare_module` preset and
its generated Wrangler config. Run `npm run deploy` to build and deploy. Configure
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `NUXT_ADMIN_SECRET`, `NUXT_ADMIN_USERNAME`, and
`NUXT_ADMIN_PASSWORD` as Worker secrets before serving traffic.

`npm run generate` also succeeds and emits a static `.output/public` (SSG) for any static
host — but DB-backed sections only populate when the Worker is running.

Admin image uploads require all `R2_*` credentials. Without them, the upload API returns
HTTP 503; it does not attempt to write to the Worker filesystem. A custom domain can be
attached separately in Cloudflare.

### Dependency audit

The dependency audit pins patched `esbuild`, `glob`, and `minimatch` versions where
upstream ranges lag, and keeps `happy-dom` at 21.0.4 or newer. One low-severity advisory
remains in `deepmerge@4.3.1`, used by the Nitro/Workbox build tooling; no patched upstream
release is available. The vulnerable package is absent from the generated Worker output.
Avoid `npm audit fix --force`, which recommends out-of-range Nuxt/PWA downgrades; recheck
for an upstream fix instead.

`netlify.toml` remains as the legacy Netlify configuration; it is not used by the
Cloudflare deploy script.

## Featured Work: Marketing-gen

The live-work grid explicitly features the `marketing-gen.pages.dev` project instead of
relying on database sort order. If that entry is unavailable, the first live project is
used as a fallback.

## Deployment Case Study: Dice Arena

Dice Arena is a Nuxt 4 web app deployed as a Cloudflare Worker using Nitro's generated
Wrangler configuration. The Worker connects to Neon Postgres through a Hyperdrive
binding; Better Auth and Drizzle provide authentication and database access.

### Architecture and operational lessons

- Use the direct, unpooled database URL for Drizzle migrations, and the Hyperdrive
  binding for application runtime traffic.
- Align Better Auth's `rate_limit.id` column with the Drizzle schema before applying migrations.
- Keep the paid-only AI Gateway declaration conditional for Neon Free-tier deployments.
  The already-provisioned gateway is retained, but Dice Arena does not use it.
- A private assets bucket and a separate `hello` Neon Function were provisioned. The
  Function and application routes were smoke-tested; the bucket and Function are not
  runtime dependencies of Dice Arena. The app does not use Neon Object Storage or Realtime.

## TODO / Roadmap

Open work and known spoofed/placeholder/conflicting data are tracked in
**[TODO.md](TODO.md)**. Highlights:

- Reconcile the stale production counts ("16+ / 4 live / 19") against the dynamic,
  seed-derived counts (now 20 / 8 live / 12 templates).
- Re-seed or update the production DB so thumbnails and URLs match the current seed/capture scripts.
- Align stale `*.netlify.app` seed URLs with the canonical `*.pages.dev` / `*.workers.dev` hosts.
- Move the `/blog` page chrome (hardcoded English) into the i18n locale files.
