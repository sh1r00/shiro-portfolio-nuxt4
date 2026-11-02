# SH1R00 Portfolio
*shiro — where style meets function*

Full-stack developer portfolio (SSR). Live at
**[shiro-portfolio-nuxt4.rasisg.workers.dev](https://shiro-portfolio-nuxt4.rasisg.workers.dev)**.

## About
Lists live projects + reusable templates (editable via an admin panel), an About section with DB-backed bio, a Contact page (mailto + form), and an admin dashboard. i18n (en/es/am), PWA, M3 dark mode.

## Stack
Nuxt 4 (SSR) · Vue 3 · Tailwind v4 · @nuxtjs/i18n · @vite-pwa/nuxt · nuxt-security · Pinia · Turso (libSQL) · bcryptjs · Cloudflare R2

## Quick Start
```bash
npm install
cp .env.example .env   # set NUXT_ADMIN_SECRET, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
npm run dev
```

For production, set `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and the three
`NUXT_ADMIN_*` values as Worker secrets, then run `npm run deploy`. Admin image
uploads also require the `R2_*` values; until configured, the Worker returns
HTTP 503 rather than writing to ephemeral disk.

## Pitfalls & Fixes
- PWA `non-precached-url` blank screen → `navigateFallback: null` + exclude `html` from precache.
- Missing `components: [{ path: '~/components', pathPrefix: false }]` → sections render empty.
- `localePath` → `const localePath = useLocalePath()`.
- `defineProps()` must be assigned: `const props = defineProps()`.
- Turso: set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in production; the local `file:` fallback is only for Node development.
- nuxt-security@2.6.0 → Node ≥24.

## Documentation
See [DOCUMENTATION.md](DOCUMENTATION.md) for full steps, functionality, and pitfalls/fixes.
