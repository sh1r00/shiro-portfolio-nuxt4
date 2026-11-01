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
- `site_content` key-value table for About bio + Contact info, editable in admin.
- Admin credential rotation (username `sh1r00`).

## Pitfalls & Fixes
- **PWA blank screen (`non-precached-url`)** — SSR has no precached index.html. Fix: `workbox.navigateFallback: null` + drop `html` from `globPatterns`.
- **Blank screen, no console errors** — missing `components: [{ path: '~/components', pathPrefix: false }]` made every organism auto-import as `OrganismsOHeroSection` and render empty.
- **`_ctx.localePath is not a function`** — `localePath` is not auto-imported; use `const localePath = useLocalePath()`.
- **`props is not defined`** — `AButton` used `props.href` without `const props = defineProps()`.
- **502 `mkdir /var/task/server/data`** — the `file:` libSQL fallback fails on Netlify's read-only FS; set `TURSO_DATABASE_URL`.
- **nuxt-security@2.6.0** needs Node ≥24 → `NODE_VERSION = "24"`.

## Deployment
Netlify SSR (`nuxi build --preset netlify`, publish `dist`), Node 24, `--legacy-peer-deps`.

## Featured Project: Dice Arena
Dice Arena is a Nuxt 4 web app deployed as a Cloudflare Worker using Nitro's generated Wrangler configuration. The Worker connects to Neon Postgres through a Hyperdrive binding; Better Auth and Drizzle provide authentication and database access.

### Architecture and operational lessons
- Use the direct, unpooled database URL for Drizzle migrations, and the Hyperdrive binding for application runtime traffic.
- Align Better Auth's `rate_limit.id` column with the Drizzle schema before applying migrations.
- Keep the paid-only AI Gateway declaration conditional for Neon Free-tier deployments. The already-provisioned gateway is retained, but Dice Arena does not use it.
- A private assets bucket and a separate `hello` Neon Function were provisioned. The Function and application routes were smoke-tested; the bucket and Function are not runtime dependencies of Dice Arena. The app does not use Neon Object Storage or Realtime.

## TODO / Roadmap
- [ ] Point a custom domain (optional) — for client-facing work; a single wildcard domain can cover all sites.
