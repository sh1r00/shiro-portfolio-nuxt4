/**
 * Long-form, blog-style bodies for each case study (rendered as markdown via
 * `renderMarkdown`). Kept separate from the structured `caseStudies.ts` data so
 * the narrative prose and code snippets can be as long as they need to be.
 */
export const caseStudyBodies: Record<string, string> = {
  'kphone-marketing': `
kPhone Marketing is an AI campaign generator that walks one idea through keyword research → audience personas → content → an editable campaign, then charges per generation with a credit balance. The interesting engineering is not the AI — it is the *plumbing* that keeps a multi-locale, monetized, split-stack app honest.

## The split-stack gotcha that shipped a broken build

The frontend is Nuxt 4; the API is a **separate Hapi.js sub-package** (its own \`package.json\` with \`"type": "commonjs"\`). The very first Render deploy shipped fine, then a later one 500'd on \`bcryptjs\`:

\`\`\`bash
Error: Cannot find module 'bcryptjs'
\`\`\`

The root \`package.json\` had the dependency listed, but Render builds from the **sub-package**. Backend dependencies that only lived in the root manifest were silently dropped on the deploy host. The fix was mechanical but easy to get wrong twice:

\`\`\`jsonc
// hapi-server/package.json — backend deps live HERE, not the root
{
  "type": "commonjs",
  "dependencies": { "bcryptjs": "^2.4.3", "joi": "^17", "..." }
}
\`\`\`

## hreflang that looked correct but did nothing

Three locales (en/es/am) with \`prefix_except_default\`. Setting \`baseUrl\` + locale \`language\`/\`iso\` in config produced **zero** \`hreflang\` links — the config alone emits nothing. You also have to merge \`useLocaleHead({ seo: true })\` in \`app.vue\`:

\`\`\`ts
const { locale } = useI18n()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
useHead(() => ({
  htmlAttrs: { lang: locale.value },
  link: (i18nHead.value?.link ?? []) as any[],
  meta: (i18nHead.value?.meta ?? []) as any[],
}))
\`\`\`

Then a related crash: non-default locale pages (\`/es/\`, \`/am/\`) threw an infinite-redirect in the navigation guard. Root cause was a stack of \`detectBrowserLanguage\` left truthy **plus** hand-added \`/es → /es/\` redirect routeRules — the definitive fix is \`detectBrowserLanguage: false\` and ISR-only routeRules, no redirects.

## A validation bug that blocked sign-ups

Individual accounts sent \`workspaceName: ""\`, and the Joi schema rejected empty strings on a field that should only matter for workspace accounts:

\`\`\`js
workspaceName: Joi.string().allow('').min(2).max(100).optional(),
\`\`\`

The lesson that repeats across this whole codebase: **the expensive bugs are the silent ones** — verify output with counts (\`grep -c\`), not presence checks, because "looks correct" is how a broken hreflang or a dropped backend dep ships.
`,
  'shop-tulu': `
Shop Tulu is a headless Shopify storefront on Nuxt. The product/category pages render through the Shopify Storefront GraphQL API, with \`@nuxt/content\` for editorial pages and \`@nuxt/image\` for media.

## The one decision that capped its SEO

The app runs \`ssr: false\` — a client-rendered SPA. That is a one-way door: crawlers that don't execute JavaScript see an empty shell, so every product title, price, and description is invisible to search until hydration.

\`\`\`ts
export default defineNuxtConfig({
  ssr: false, // SPA-only — product text is not in static HTML
})
\`\`\`

The mitigation was to prerender the key routes so the most important pages still ship static HTML, but the structural fix is to flip SSR on for catalog routes and opt *app* routes out with \`routeRules\` — never the reverse (opt content routes back in with \`ssr: true\`, which Nuxt will not honor).

## Layout shift from web fonts

Self-hosted fonts were still causing CLS, so \`@nuxtjs/fontaine\` was added to reserve exact font metrics before the font loads, eliminating the shift.

For a commerce store, **SEO is revenue** — SSR/prerender is a launch gate, not a nicety.
`,
  'credit-wiz': `
Credit Wiz is a loan lead-gen frontend: a hero, a benefit list, and a third-party loan form (\`formrequests.com\`), with a Nuxt/Leaflet locator and \`vue-i18n\` on the content side.

## A CSP that silently killed the form

The site ships a strict \`nuxt-security\` CSP. It correctly allowed \`formrequests.com\` in \`script-src\`, \`connect-src\`, and \`frame-src\` — but the form's submission was blocked by one directive:

\`\`\`ts
'form-action': ["'self'"], // ← blocked POSTs to formrequests.com
\`\`\`

The form loader injects a form whose action posts to the third party, so \`form-action: 'self'\` prevented the submit. The fix:

\`\`\`ts
'form-action': ["'self'", 'https://formrequests.com'],
\`\`\`

## The token trap that broke the aesthetic layer

The project uses \`tailwind-material-colors\`, which **bakes static colors into Tailwind utility classes** — there is no \`--color-primary-container\` variable at runtime. The first zeitgeist pass referenced \`rgb(var(--color-primary-container))\`, which silently computed to \`transparent\`. The fix is to use the **literal hex** (\`#3048c4\`) everywhere a glow/spotlight/accent is needed, and to skip tilt/parallax on the working loan form (those \`transform\`s break a form's stacking context).

The takeaway: a lead-gen site lives or dies on its form actually submitting — a CSP that blocks it is worse than no CSP at all.
`,
  'money-conversion': `
The Money Conversion SPA is a Nuxt 4 utility app (converter, income calculator, curated resources) that grew the full i18n/SEO/PWA/security treatment.

## The live feed that was 100% fake

The original "live activity feed" was a seed array of invented events (\`Someone in New York just explored…\`) plus a \`setInterval\` that fabricated a new one every few seconds. Nothing real backed it.

The fix was to replace fabrication with a **real market feed**: a free CoinGecko endpoint, passed through a server-side filter, so the feed only ever shows genuine movement:

\`\`\`ts
// app/utils/marketFilter.ts — the "backend filter"
export function significantMovers(snapshots, minAbs24hPct = 1) {
  return snapshots
    .filter((s) => Math.abs(s.change_24h_pct) >= minAbs24hPct)
    .sort((a, b) => Math.abs(b.change_24h_pct) - Math.abs(a.change_24h_pct))
}
\`\`\`

The filter's rules, each with a justification: top-N by market cap with stablecoins excluded (pegged assets never move — pure noise), keep only rendered metrics, a significance threshold so "BTC +0.02%" never shows, idempotent upserts, a freshness TTL, numeric sanitization, and the DB as the cache so the browser never hammers the upstream.

## Gamification that returned nothing

The daily check-in incremented a localStorage counter and showed a toast — no unlock, no benefit. It was removed entirely; visit tracking (\`markVisit\`) moved to the layout so the "welcome back" greeting still works honestly.

The lesson: a utility SPA is thin on content, but it can still be *real* — replace every spoofed number with either a genuine data source or nothing.
`,
  'mehari-global': `
Mehari Global Solutions is a BPO company site (Nuxt 4, en/am, PWA, \`nuxt-security\`, SQLite admin). This one centered on a rebrand and a localization gap.

## A brand rename across the whole surface

The company rebranded **Mahari → Mehari**. That is a text swap for the visible name, but an app-identity change for the technical identifiers — the Android/iOS bundle id \`com.mahariglobalsolutions.meti\`, the contact email domain, and the Render service name all carried the old spelling and each has downstream consequences (app-store identity, DNS, a new Render service on blue-green deploy).

## The logo name that was hardcoded English

The header rendered the company name as a hardcoded string, so the Amharic locale still showed Latin "Mahari Global Solutions LLC". The fix localizes the brand name the same way as any other string:

\`\`\`json
{ "brand": { "name": "Mehari Global Solutions LLC" } }
\`\`\`

\`\`\`json
{ "brand": { "name": "መሃሪ ግሎባል ሶሉሽንስ LLC" } }
\`\`\`

\`\`\`vue
<div class="font-display">{{ t('brand.name') }}</div>
\`\`\`

The tagline had the inverse bug — it was *already* i18n'd, but the DB-backed \`info.tagline\` (single English value) overrode the localized key, so Amharic visitors still saw English. The header now reads the locale key directly.

The lesson: a corporate site lives and dies on SEO + trust — the localized brand name is table stakes, and the missing \`@nuxtjs/seo\` module (no sitemap/canonical) is the top remaining fix.
`,
  'skilled-trades': `
The Skilled Trades Marketplace connects customers with trade professionals — listings, profiles, and the core flows, with a Vitest unit suite backing them.

## A marketplace is the highest-security-stakes project in the folder

Unlike the marketing sites, this one has auth, listings, and (eventually) payments. The first pass flagged that the dependency scan returned no matched modules, so the stack details need re-verification before trusting any security claim.

The checklist that matters here:

\`\`\`bash
npm run test   # the suite — a strong foundation the other projects lack
\`\`\`

The open item is wiring \`nuxt-security\` + row-level security end-to-end and confirming least-privilege database roles — a marketplace's attack surface (auth, IDOR on listings, payment flows) is orders of magnitude larger than a static marketing page.

The lesson: audit the marketplace *first* — it is where a security miss costs real users, not just rankings.
`,
  'dice-arena': `
Dice Arena is a 3D dice-roll game prototype on TresJS/Three.js, deployed to Cloudflare Workers — the most experimental project in the folder.

## 3D that ships heavy

A WebGL scene (TresJS) pulls a large bundle and can hurt LCP if it renders eagerly. The right pattern is to lazy-load the scene and gate it behind a user gesture so first paint stays fast.

\`\`\`ts
// Client-only 3D boundary, mounted on demand — not during first paint
const showArena = ref(false)
\`\`\`

## A prototype, not a product

It ships i18n and edge deployment but **no \`nuxt-security\`, no PWA, no SEO** — acceptable for a prototype, not for a launch. Before treating it as shipped, add \`nuxt-security\` and a sitemap; both are cheap now and expensive later.

The lesson: prototypes need a "harden before launch" checklist, because security + SEO retrofits cost more the longer they wait.
`,
}
