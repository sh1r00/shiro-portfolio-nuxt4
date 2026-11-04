# SH1R00 Portfolio — Documentation

## Functionality
Full-stack developer portfolio (SSR). Lists live projects + reusable templates (both editable from an admin panel), an About section with DB-backed bio, a Contact page (mailto + form), and an admin dashboard. i18n (en/es/am), PWA, M3 dark mode.

## Stack
Nuxt 4 (SSR) · Vue 3 · Tailwind v4 · @nuxtjs/i18n · @vite-pwa/nuxt · nuxt-security · Pinia · @libsql/client (Turso) · bcryptjs · @aws-sdk/client-s3 (Cloudflare R2)

## Steps Taken
- Migrated SSG → SSR so works data + admin are runtime-editable.
- libSQL/Turso backend (`file:` in dev, `libsql://` in prod).
- Admin panel: bcrypt + h3 signed session + `requireAdmin` middleware.
- R2 thumbnail uploads (magic-number validation, SVG disallowed).
- Contact form + Contact page with mailto drawn from the DB.
- `site_content` key-value table for About bio + Contact info, editable in admin. The editable bio is shown in English; Spanish and Amharic use their translated catalog copy.
- Admin credential rotation (username `sh1r00`).

## Pitfalls & Fixes
- **PWA blank screen (`non-precached-url`)** — SSR has no precached index.html. Fix: `workbox.navigateFallback: null` + drop `html` from `globPatterns`.
- **Blank screen, no console errors** — missing `components: [{ path: '~/components', pathPrefix: false }]` made every organism auto-import as `OrganismsOHeroSection` and render empty.
- **`_ctx.localePath is not a function`** — `localePath` is not auto-imported; use `const localePath = useLocalePath()`.
- **`props is not defined`** — `AButton` used `props.href` without `const props = defineProps()`.
- **Production database** — Workers have no durable local filesystem. Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; the local `file:` fallback is only for Node development.
- **nuxt-security@2.6.0** needs Node ≥24 → `NODE_VERSION = "24"`.

## Deployment
Production runs on Cloudflare Workers using Nitro's `cloudflare_module` preset and its generated Wrangler config. Run `npm run deploy` to build and deploy. Configure `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `NUXT_ADMIN_SECRET`, `NUXT_ADMIN_USERNAME`, and `NUXT_ADMIN_PASSWORD` as Worker secrets before serving traffic.

Admin image uploads require all `R2_*` credentials. Without them, the upload API returns HTTP 503; it does not attempt to write to the Worker filesystem. A custom domain can be attached separately in Cloudflare.

The dependency audit pins patched `esbuild`, `glob`, and `minimatch` versions where upstream ranges lag, and keeps `happy-dom` at 21.0.4 or newer. One low-severity advisory remains in `deepmerge@4.3.1`, used by the Nitro/Workbox build tooling; no patched upstream release is available. The vulnerable package is absent from the generated Worker output. Avoid `npm audit fix --force`, which recommends out-of-range Nuxt/PWA downgrades; recheck for an upstream fix instead.

`netlify.toml` remains as the legacy Netlify configuration; it is not used by the Cloudflare deploy script.

## Featured Work: Marketing-gen
The live-work grid explicitly features the `marketing-gen.pages.dev` project instead of relying on database sort order. If that entry is unavailable, the first live project is used as a fallback.

## Deployment Case Study: Dice Arena
Dice Arena is a Nuxt 4 web app deployed as a Cloudflare Worker using Nitro's generated Wrangler configuration. The Worker connects to Neon Postgres through a Hyperdrive binding; Better Auth and Drizzle provide authentication and database access.

### Architecture and operational lessons
- Use the direct, unpooled database URL for Drizzle migrations, and the Hyperdrive binding for application runtime traffic.
- Align Better Auth's `rate_limit.id` column with the Drizzle schema before applying migrations.
- Keep the paid-only AI Gateway declaration conditional for Neon Free-tier deployments. The already-provisioned gateway is retained, but Dice Arena does not use it.
- A private assets bucket and a separate `hello` Neon Function were provisioned. The Function and application routes were smoke-tested; the bucket and Function are not runtime dependencies of Dice Arena. The app does not use Neon Object Storage or Realtime.

## Case Studies
Per-project case studies live in `app/data/caseStudies.ts` and render at `/case-study/[slug]` — one page, slug per live project (`kphone-marketing`, `shop-tulu`, `credit-wiz`, `money-conversion`, `mahari-global`, `skilled-trades`, `dice-arena`). Each covers base start, weaknesses, fixes, problems + fixes, and lessons. The Works section renders a "Case studies" quick-nav linking to each.

## TODO / Roadmap
- [x] Real screenshots for the 7 live projects — captured via `scripts/capture-screenshots.mjs` (Playwright + system Edge) and DB `thumbnail` fields set via `scripts/update-thumbnails.mjs`.
- [ ] Refresh the 12 **template** screenshots — they still use the stale Jul 6 captures (`restaurant-editable`, `realty-creditors`, `your-blog`) or empty thumbnails.
- [ ] Add Cloudflare R2 for uploaded media (keep Turso for structured portfolio data): create a bucket and configure `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, and `R2_PUBLIC_URL` to re-enable admin image uploads.
- [ ] Point a custom domain (optional) — for client-facing work; a single wildcard domain can cover all sites.
