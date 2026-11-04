export interface CaseStudyProblem {
  problem: string
  fix: string
}

export interface CaseStudy {
  slug: string
  title: string
  url: string
  host: string
  stack: string
  summary: string
  baseStart: string
  weaknesses: string[]
  fixes: string[]
  problems: CaseStudyProblem[]
  lessons: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'kphone-marketing',
    title: 'kPhone Marketing',
    url: 'https://marketing-gen.pages.dev',
    host: 'marketing-gen.pages.dev',
    stack: 'Nuxt 4 · Hapi.js · MongoDB · OpenAI · Google Ads · Stripe · Brevo · Sentry',
    summary:
      'An AI marketing campaign generator that carries one idea through keyword research → audience personas → content → an editable campaign, monetized pay-per-run with credits.',
    baseStart:
      'Started as a client-rendered SPA on Netlify with a Hapi.js backend, a MongoDB Atlas store, and a pay-per-generation credit model. The first milestone was a working research→content pipeline with Stripe credit packs.',
    weaknesses: [
      'Weak homepage meta description ("AI-powered marketing campaign generator" — 13 generic words).',
      'No hreflang cross-linking across en/es/am locales (Google saw three duplicate sites).',
      'Auth pages (login/signup/forgot-password) were indexed and in the sitemap.',
      'No OG image; Google Fonts CDN was render-blocking.',
      'Fabricated trust stats/team/email on About + Legal pages.',
    ],
    fixes: [
      'Rewrote the homepage description in all 3 locales (~150 chars, value-prop + CTA).',
      'Added i18n `baseUrl` + locale `language`/`iso` + `useLocaleHead({ seo: true })`.',
      '`robots: false` on auth routes; self-hosted fonts; SoftwareApplication/BreadcrumbList JSON-LD.',
      'Flagged placeholder content via `contentFlags` + admin-dashboard banner.',
    ],
    problems: [
      { problem: 'hreflang links silently missing', fix: 'config fix alone was not enough — also merged `useLocaleHead({ seo:true })` in `app.vue`.' },
      { problem: '5.4 MB self-hosted icon font blew past Workbox 2 MiB limit', fix: 'raised `workbox.maximumFileSizeToCacheInBytes` to 6 MiB.' },
      { problem: '500 on every prerendered route after adding a plugin', fix: 'manual Pinia plugin sorts alphabetically — added `dependsOn: [\'pinia\']`.' },
      { problem: '`Cannot find module bcryptjs` on Render', fix: 'moved backend deps into the `hapi-server` sub-package + `.npmrc` + `.node-version`.' },
      { problem: 'Infinite redirect crash on `/es/` `/am/`', fix: '`detectBrowserLanguage: false` + removed `/es→/es/` redirect routeRules.' },
    ],
    lessons: [
      'The expensive bugs are the silent ones — verify output with counts (`grep -c`), not presence checks.',
      '`ssr: false` is one-way: opt app routes out, never content routes in.',
    ],
  },
  {
    slug: 'shop-tulu',
    title: 'Shop Tulu',
    url: 'https://shop-tulu.pages.dev',
    host: 'shop-tulu.pages.dev',
    stack: 'Nuxt · Shopify Storefront · @nuxt/content · @nuxt/image · Fontaine · PWA · nuxt-security',
    summary:
      'A Shopify Storefront e-commerce frontend with content-driven pages, image optimization, and offline-first PWA.',
    baseStart:
      'Built as a headless storefront on Shopify Storefront (GraphQL), with Nuxt rendering product/category pages and `@nuxt/content` for editorial pages.',
    weaknesses: [
      'Runs `ssr: false` (SPA-only) — product text is not in static HTML, so SEO depends entirely on client hydration.',
      'Relies on prerender for SEO coverage rather than SSR.',
    ],
    fixes: [
      '`nuxt-security` + PWA hardening for the storefront.',
      '`@nuxtjs/fontaine` to eliminate layout shift from web fonts.',
    ],
    problems: [
      { problem: 'SPA-only means crawlers see an empty shell', fix: 'prerender key routes; long-term, enable SSR for catalog pages.' },
      { problem: 'Client-side cart/persisted state hydration', fix: '`pinia-plugin-persistedstate-2` + `nuxt-lazy-hydrate` to defer non-critical JS.' },
    ],
    lessons: ['For a commerce store, SEO = revenue — treat SSR/prerender as a launch gate, not a nicety.'],
  },
  {
    slug: 'credit-wiz',
    title: 'Credit Wiz',
    url: 'https://credit-wizard.pages.dev',
    host: 'credit-wizard.pages.dev',
    stack: 'Nuxt · @nuxt/content · @nuxt/image · Leaflet maps · vue-i18n · PWA · nuxt-security',
    summary:
      'A credit/creditor location tool with interactive Leaflet maps, content-driven guides, and multi-language support.',
    baseStart:
      'Began as a map-driven locator (Leaflet) for credit/realty providers, with `@nuxt/content` powering how-to guides and `vue-i18n` for localization.',
    weaknesses: [
      'No `@nuxtjs/seo` module — only `@nuxtjs/robots`, so no auto sitemap/canonical/llms.txt.',
      'Uses `vue-i18n` (not `@nuxtjs/i18n`) — different locale/SEO integration path.',
    ],
    fixes: [
      '`nuxt-security` + PWA present; map interactions kept client-only to avoid SSR map-bundle bloat.',
    ],
    problems: [
      { problem: 'Missing structured data + canonical for content pages', fix: 'add `@nuxtjs/seo` (or hand-rolled sitemap + JSON-LD LocalBusiness).' },
      { problem: 'Leaflet is heavy and SSR-hostile', fix: 'lazy-load the map component and keep tiles client-rendered.' },
    ],
    lessons: ['A locator/guides site is exactly the kind that wins on SEO — the SEO module gap is the top fix.'],
  },
  {
    slug: 'money-conversion',
    title: 'Money Conversion SPA',
    url: 'https://trading-bot-dxt.pages.dev',
    host: 'trading-bot-dxt.pages.dev',
    stack: 'Nuxt 4 · @nuxtjs/i18n · @nuxtjs/seo · PWA · nuxt-security',
    summary:
      'A currency conversion single-page app with full i18n (en/es/am), SEO module, PWA, and security hardening.',
    baseStart:
      'Started as a focused conversion SPA (rates + conversions), then gained the full i18n/SEO/PWA/security treatment.',
    weaknesses: [
      'A utility SPA is thin on indexable content — few crawlable pages beyond the converter.',
    ],
    fixes: [
      'Full `@nuxtjs/seo` (sitemap/robots/llms.txt) + i18n hreflang + PWA + security headers in place.',
    ],
    problems: [
      { problem: 'Little static content to rank on', fix: 'add supporting guide pages (rate tables, "how FX works") for search surface.' },
    ],
    lessons: ['Even a utility SPA should ship a handful of SEO content pages to be discoverable.'],
  },
  {
    slug: 'mahari-global',
    title: 'Mahari Global Solutions',
    url: 'https://meti-site.onrender.com',
    host: 'meti-site.onrender.com',
    stack: 'Nuxt 4 · @nuxtjs/i18n · PWA · nuxt-security',
    summary:
      'A corporate/business site with en/es/am localization, PWA, and security — the SEO module is the missing piece.',
    baseStart:
      'Built as a multi-language corporate presence (en/es/am) with PWA installability and security hardening.',
    weaknesses: [
      'No `@nuxtjs/seo` module — no auto sitemap, canonical, or llms.txt.',
      'Deployed on Render (`.onrender.com`) rather than a static/edge host — slower cold starts and weaker edge caching.',
    ],
    fixes: [
      'i18n + PWA + nuxt-security are all present; the stack is otherwise solid.',
    ],
    problems: [
      { problem: 'No sitemap/canonical → weak crawl coverage', fix: 'add `@nuxtjs/seo` and prerender the public pages.' },
      { problem: 'Render cold-start latency on a marketing site', fix: 'consider Cloudflare Pages/Workers for the public site, keep Render for the API.' },
    ],
    lessons: ['A corporate site lives and dies on SEO + load speed — the missing SEO module and the Render host are the two highest-leverage fixes.'],
  },
  {
    slug: 'skilled-trades',
    title: 'Skilled Trades Marketplace',
    url: 'https://skilled-trades-marketplace.vercel.app',
    host: 'skilled-trades-marketplace.vercel.app',
    stack: 'Nuxt 4 · marketplace (trades) · vitest suite',
    summary:
      'A marketplace connecting customers with skilled trades professionals, backed by a test suite.',
    baseStart:
      'Built as a two-sided marketplace (customers ↔ trades pros) with listings, profiles, and a Vitest unit suite for the core flows.',
    weaknesses: [
      'Stack details need a first-pass re-verification (the dependency scan returned no matched modules).',
    ],
    fixes: [
      'Has a test suite (`npm run test`) — a strong foundation not shared by the other projects.',
    ],
    problems: [
      { problem: 'Marketplace surface (auth, listings, payments) is a large attack area', fix: 'verify nuxt-security + RLS/least-privilege are wired end-to-end.' },
    ],
    lessons: ['A marketplace is the highest-security-stakes project in the folder — audit it first.'],
  },
  {
    slug: 'dice-arena',
    title: 'Dice Arena',
    url: 'https://sh1r00-dice-arena.rasisg.workers.dev',
    host: 'sh1r00-dice-arena.rasisg.workers.dev',
    stack: 'Nuxt · TresJS (3D) · @nuxtjs/i18n · wrangler',
    summary:
      'A 3D dice-roll game prototype built with TresJS on Cloudflare Workers — the most experimental project in the folder.',
    baseStart:
      'Started as a 3D (TresJS/Three.js) interactive prototype deployed to Cloudflare Workers, with i18n wired in.',
    weaknesses: [
      'No `nuxt-security`, no PWA, no SEO module — it is a prototype, not a hardened production site.',
    ],
    fixes: [
      'i18n + edge deployment (Workers) in place; 3D rendering kept client-side.',
    ],
    problems: [
      { problem: '3D bundle + WebGL is heavy and can hurt LCP', fix: 'lazy-load the 3D scene and gate it behind a user gesture.' },
      { problem: 'No security/SEO at all', fix: 'add nuxt-security + a sitemap before treating it as a shipped product.' },
    ],
    lessons: ['Prototypes need a "harden before launch" checklist — security + SEO can be added cheaply and later cost much more.'],
  },
]

export function caseStudyBySlug(slug: string) {
  return caseStudies.find(cs => cs.slug === slug)
}

export function caseStudyForHost(hostname: string) {
  return caseStudies.find(cs => hostname?.toLowerCase() === cs.host)
}
