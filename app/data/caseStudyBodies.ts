/**
 * Long-form, blog-style bodies for each case study (rendered as markdown via
 * `renderMarkdown`). Kept separate from the structured `caseStudies.ts` data so
 * the narrative prose and code snippets can be as long as they need to be.
 *
 * The renderer (`app/utils/renderMarkdown.ts`) supports headings, paragraphs,
 * fenced code blocks, inline code, bold, links, and unordered lists. It does
 * NOT render images, so these bodies intentionally contain no image markdown.
 */
export const caseStudyBodies: Record<string, string> = {
  'kphone-marketing': `
kPhone Marketing is an AI campaign generator that carries one idea through keyword research → audience personas → content → an editable campaign, then charges per generation with a credit balance. The interesting engineering here was never the AI — the model call is a single function. The interesting part was the *plumbing* that keeps a multi-locale, monetized, split-stack app honest when the incentives are stacked against you.

The app started as a client-rendered SPA on Netlify, with a **separate Hapi.js backend**, a MongoDB Atlas store, and a pay-per-generation credit model backed by Stripe credit packs. The first milestone was a working research → content pipeline, and from there every feature that followed — i18n, auth, billing — was bolted onto that skeleton.

## The split-stack gotcha that shipped a broken build

The frontend is Nuxt 4; the API is a **separate Hapi.js sub-package** with its own \`package.json\` and \`"type": "commonjs"\`. The very first Render deploy shipped clean, then a later one 500'd on \`bcryptjs\`:

\`\`\`bash
Error: Cannot find module 'bcryptjs'
\`\`\`

The root \`package.json\` listed the dependency, but Render builds from the **sub-package**. Backend dependencies that only lived in the root manifest were silently dropped on the deploy host. The fix was mechanical but easy to get wrong twice:

\`\`\`jsonc
// hapi-server/package.json — backend deps live HERE, not the root
{
  "type": "commonjs",
  "engines": { "node": ">=20" },
  "dependencies": {
    "@hapi/hapi": "^21",
    "bcryptjs": "^2.4.3",
    "joi": "^17",
    "mongodb": "^6",
    "stripe": "^16",
    "@sentry/node": "^8"
  }
}
\`\`\`

The deeper lesson is that a monorepo-in-spirit-but-not-in-tooling has no single source of truth for "what runs where". The root manifest and the sub-package manifest drift, and the drift only surfaces as a 500 in production.

## The campaign pipeline, end to end

The actual product flow is a sequence of gated steps, each one spending from the user's credit balance and each one feeding the next. The backend routes are thin Hapi handlers that validate, debit, call the model, and persist:

\`\`\`js
// hapi-server/src/routes/campaign.js (CommonJS, trimmed)
const Joi = require('joi')

const campaignPayload = Joi.object({
  idea: Joi.string().min(3).max(200).required(),
  step: Joi.string().valid('keywords', 'personas', 'content', 'campaign').required(),
  locale: Joi.string().valid('en', 'es', 'am').default('en'),
})

async function runGeneration(request, h) {
  const { idea, step } = request.payload
  const credits = await getCredits(request.auth.credentials.id)
  if (credits < COST[step]) return h.response({ error: 'insufficient_credits' }).code(402)

  const result = await generate({ idea, step, locale: request.payload.locale })
  await debitCredits(request.auth.credentials.id, COST[step])
  await saveStep(request.auth.credentials.id, step, result)
  return result
}
\`\`\`

What surprised me was how little of the code is "AI". The model call is a thin wrapper over OpenAI with a few prompt templates; roughly three-quarters of the backend is auth, validation, credit accounting, and persistence — the unglamorous parts that decide whether people actually get billed correctly and stay logged in.

## hreflang that looked correct but did nothing

Three locales (en/es/am) with \`prefix_except_default\`. Setting \`baseUrl\` plus locale \`language\`/\`iso\` in config produced **zero** \`hreflang\` links — the config alone emits nothing. You also have to merge \`useLocaleHead({ seo: true })\` in \`app.vue\`:

\`\`\`ts
const { locale } = useI18n()
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })
useHead(() => ({
  htmlAttrs: { lang: locale.value },
  link: (i18nHead.value?.link ?? []) as any[],
  meta: (i18nHead.value?.meta ?? []) as any[],
}))
\`\`\`

Then a related crash: non-default locale pages (\`/es/\`, \`/am/\`) threw an infinite redirect in the navigation guard. Root cause was a stack of \`detectBrowserLanguage\` left truthy **plus** hand-added \`/es → /es/\` redirect routeRules. The definitive fix is \`detectBrowserLanguage: false\` and ISR-only routeRules, no hand-written redirects.

## A validation bug that blocked sign-ups

Individual accounts sent \`workspaceName: ""\`, and the Joi schema rejected empty strings on a field that should only matter for workspace accounts:

\`\`\`js
workspaceName: Joi.string().allow('').min(2).max(100).optional(),
\`\`\`

One line, but it silently blocked an entire account tier. The same class of bug showed up in the credit accounting — a race between "check balance" and "debit balance" that could let a user run one generation on an empty balance. The fix was a single atomic update with a \`$gte\` guard on the balance rather than read-then-write.

## What I'd do differently

I'd start with the Hapi backend and the Nuxt frontend in a real monorepo workspace from day one, so dependency placement stops being a deploy-time lottery. I'd also add a smoke test that boots the API on Render's Node version and makes one authenticated, credit-consuming request — the current test coverage is thin exactly where the money moves. And I'd treat \`detectBrowserLanguage: false\` as a launch gate instead of discovering it through a redirect loop.

## Key takeaways

- The expensive bugs are the silent ones — verify output with counts (\`grep -c\`), not presence checks.
- \`ssr: false\` is one-way: opt app routes out, never content routes in.
- Keep manifests for split stacks in one place, or the deploy host will pick the wrong one for you.
- Billing logic needs atomic, conditional writes — read-then-write is a race, not a safeguard.
`,
  'shop-tulu': `
Shop Tulu is a headless Shopify storefront built on Nuxt. Product and category pages render through the Shopify Storefront GraphQL API, \`@nuxt/content\` powers editorial pages, and \`@nuxt/image\` handles media. The whole thing ships as a PWA behind \`nuxt-security\`.

The storefront pattern is appealing precisely because it separates catalog data from presentation. Shopify stays the source of truth for products, prices, and inventory, and Nuxt becomes a fast, fully-controlled frontend — but that split is also where the trade-offs hide.

## The one decision that capped its SEO

The app runs \`ssr: false\` — a client-rendered SPA. That is a one-way door: crawlers that don't execute JavaScript see an empty shell, so every product title, price, and description is invisible to search until hydration.

\`\`\`ts
export default defineNuxtConfig({
  ssr: false, // SPA-only — product text is not in static HTML
})
\`\`\`

The mitigation was to prerender the key routes so the most important pages still ship static HTML. But the structural fix is to flip SSR on for catalog routes and opt *app* routes out with \`routeRules\` — never the reverse, because opting content routes back in with \`ssr: true\` is something Nuxt will not honor once \`ssr: false\` is set globally.

## Querying the Storefront API

The catalog is fetched over GraphQL, which is both the strength and the footgun of headless commerce. The query below is representative — it has to be shaped carefully because Storefront punishes over-fetching with rate limits:

\`\`\`graphql
query Product($handle: String!) {
  product(handle: $handle) {
    title
    descriptionHtml
    priceRange { minVariantPrice { amount currencyCode } }
    images(first: 6) { edges { node { url altText } } }
    variants(first: 10) {
      edges { node { id title price { amount currencyCode } } }
    }
  }
}
\`\`\`

On the Nuxt side the query lives in a composable so every product page shares one data path, with \`@nuxt/image\` remapping Shopify's CDN URLs through the optimizer for responsive \`srcset\` output.

## Layout shift from web fonts

Self-hosted fonts were still causing CLS — the browser painted fallback text at one width and then reflowed when the real font arrived. \`@nuxtjs/fontaine\` was added to reserve exact font metrics up front:

\`\`\`ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/fontaine'],
  fontMetrics: {
    fonts: [{ family: 'Inter', fallbacks: ['Arial'] }],
  },
})
\`\`\`

The shift vanished because the fallback font now occupies the same advance width as the web font before it loads.

## Cart state that survived reloads

A storefront without a persistent cart loses sales on every refresh. The cart was moved out of a plain \`ref\` into persisted Pinia state so the session survives navigation and refresh:

\`\`\`ts
// stores/cart.ts
export const useCartStore = defineStore('cart', {
  state: () => ({ lines: [] as CartLine[] }),
  getters: { count: s => s.lines.reduce((n, l) => n + l.quantity, 0) },
  persist: true, // pinia-plugin-persistedstate
})
\`\`\`

Non-critical JS was also deferred with lazy-hydration so the product image and price paint before the cart bundle.

## What I'd do differently

I would have made SSR-on for catalog routes a launch gate rather than a backlog item. Prerendering a handful of URLs is a band-aid; it papered over the real problem and delayed the structural fix. I'd also add a nightly CI job that hits a sample of product URLs and asserts the rendered HTML contains the product title — a crawler-simulation test that would have caught the empty shell the moment it was introduced.

## Key takeaways

- For a commerce store, SEO is revenue — treat SSR/prerender as a launch gate, not a nicety.
- Shape Storefront queries to return exactly what a page renders; over-fetching is billed in rate limits and latency.
- Persist the cart — a storefront that forgets a customer's cart on refresh is leaving money on the table.
- Reserve font metrics up front; CLS on a product page is a silent conversion tax.
`,
  'credit-wiz': `
Credit Wiz is a loan lead-gen frontend: a hero, a benefit list, and a third-party loan form, with a Nuxt/Leaflet locator for finding providers and \`vue-i18n\` on the content side. It is, in the truest sense, a site that lives or dies on one thing — whether the form actually submits and whether crawlers can find the pages.

The stack is Nuxt with \`@nuxt/content\` for guides, \`@nuxt/image\` for media, Leaflet for the map, \`vue-i18n\` for localization, and \`nuxt-security\` + PWA for hardening. What it was missing, at the time, was \`@nuxtjs/seo\` — and for a locator/guides site, that gap is the top-ranking problem.

## A CSP that silently killed the form

The site ships a strict \`nuxt-security\` CSP. It correctly allowed \`formrequests.com\` in \`script-src\`, \`connect-src\`, and \`frame-src\` — but the form's submission was blocked by a single directive:

\`\`\`ts
'form-action': ["'self'"], // ← blocked POSTs to formrequests.com
\`\`\`

The form loader injects a form whose action posts to the third party, so \`form-action: 'self'\` prevented the submit. The fix:

\`\`\`ts
'form-action': ["'self'", 'https://formrequests.com'],
\`\`\`

This is the kind of bug that is invisible until a real lead tries to convert. Everything else on the page works, the network tab shows the script loading, and only the final POST is silently dropped by the browser. A lead-gen site with a blocked form is functionally a brochure.

## The token trap that broke the aesthetic layer

The project uses \`tailwind-material-colors\`, which **bakes static colors into Tailwind utility classes** — there is no \`--color-primary-container\` variable at runtime. A first zeitgeist pass referenced \`rgb(var(--color-primary-container))\`, which silently computed to \`transparent\`:

\`\`\`ts
// WRONG — no such variable exists at runtime
boxShadow: '0 0 2rem rgb(var(--color-primary-container) / 0.6)'

// RIGHT — use the literal hex baked into the utility classes
boxShadow: '0 0 2rem #3048c4'
\`\`\`

The glow, the spotlight, the accent — all of it vanished into a transparent nothing because the token lookup failed. The fix was to use the literal hex from \`tailwind.config.js\` everywhere a glow or accent is needed, and to skip tilt/parallax on the working loan form entirely, since those \`transform\`s break a form's stacking context (the field dropdowns render behind siblings and stop receiving clicks).

## A map that wanted to hurt first paint

Leaflet is heavy and SSR-hostile — pulling the map bundle into the main chunk inflates both the JS budget and the first paint. The locator was split into a client-only component that lazy-loads:

\`\`\`vue
<script setup lang="ts">
// Client-only Leaflet boundary — the map chunk is fetched on demand,
// not during first paint.
const MapLocator = defineAsyncComponent(() =>
  import('~/components/molecules/MLocatorMap.vue'),
)
</script>

<template>
  <ClientOnly>
    <MapLocator />
    <template #fallback>
      <div class="aspect-video animate-pulse rounded-xl bg-surface" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
\`\`\`

Tiles stay client-rendered, the component never runs on the server, and the map only costs a visitor who actually scrolls to it.

## vue-i18n is not @nuxtjs/i18n

One detail worth naming: this project uses \`vue-i18n\` directly rather than \`@nuxtjs/i18n\`. That works fine for string translation, but it means there is no automatic per-locale \`hreflang\`, no locale-prefixed routing, and no SEO integration out of the box. On a locator/guides site that wants to rank in multiple languages, that gap compounds with the missing SEO module.

## What I'd do differently

I'd add \`@nuxtjs/seo\` (or a hand-rolled sitemap plus JSON-LD \`LocalBusiness\`) as the very next change, and I'd write a Cypress/Playwright test that fills and submits the loan form and asserts the third-party POST actually fires — a test that would have caught the \`form-action\` bug in CI instead of in production.

## Key takeaways

- A lead-gen site lives or dies on its form actually submitting — a CSP that blocks it is worse than no CSP at all.
- When a token scheme bakes static colors, there is no runtime CSS variable — use the literal hex.
- Keep the map out of the critical path; lazy-load it behind a client-only boundary.
- For any locator/guides site, the SEO module is not a nice-to-have — it is the product.
`,
  'money-conversion': `
The Money Conversion SPA is a Nuxt 4 utility app — a converter, an income calculator, and a handful of curated resources — that grew the full i18n/SEO/PWA/security treatment. It is small, focused, and exactly the kind of project where a temptation shows up: because there is so little content, it is easy to invent some to make it feel alive.

This case study is really about a decision I made twice, in opposite directions: first to fake a "live" feed to make the app feel dynamic, and then to rip the fake out and replace it with something real.

## The live feed that was 100% fake

The original "live activity feed" was a seed array of invented events (\`Someone in New York just explored…\`) plus a \`setInterval\` that fabricated a new one every few seconds. Nothing real backed it — every entry was fiction, and the interval just made the fiction feel urgent.

The fix was to replace fabrication with a **real market feed**: a free CoinGecko endpoint, passed through a server-side filter, so the feed only ever shows genuine movement:

\`\`\`ts
// app/utils/marketFilter.ts — the "backend filter"
export function significantMovers(snapshots, minAbs24hPct = 1) {
  return snapshots
    .filter((s) => Math.abs(s.change_24h_pct) >= minAbs24hPct)
    .sort((a, b) => Math.abs(b.change_24h_pct) - Math.abs(a.change_24h_pct))
}
\`\`\`

The filter's rules, each with a justification: top-N by market cap with stablecoins excluded (pegged assets never move — pure noise), keep only rendered metrics, a significance threshold so \`BTC +0.02%\` never shows, idempotent upserts, a freshness TTL, numeric sanitization, and the DB as the cache so the browser never hammers the upstream.

## Gamification that returned nothing

The daily check-in incremented a \`localStorage\` counter and showed a toast — no unlock, no benefit. It was gamification theater: a number that went up for no reason. It was removed entirely. Visit tracking (\`markVisit\`) moved to the layout so the "welcome back" greeting still works honestly, but there is no fake streak, no fake badge, and no invented reward.

## The honest version of a thin app

A utility SPA is thin on content, but that is a product constraint, not a license to fabricate. The app now ships the handful of SEO content pages that a converter can legitimately support — rate tables and a "how FX works" explainer — which both help discoverability and give the search engine something real to index:

\`\`\`ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@nuxtjs/i18n', '@vite-pwa/nuxt', 'nuxt-security'],
  site: { url: 'https://trading-bot-dxt.pages.dev', name: 'Money Conversion' },
})
\`\`\`

The i18n is full lockstep (en/es/am), PWA and security headers are in place, and \`@nuxtjs/seo\` generates the sitemap, robots, and llms.txt that a utility app needs to be found at all.

## What I'd do differently

I would not have shipped the fake feed in the first place — not because it was malicious, but because it created the exact trust problem a finance-adjacent tool must never have. If I were rebuilding it, I'd wire the real data source before writing a single line of the feed UI, and I'd gate any "live" element behind an actual backend signal rather than a \`setInterval\`.

## Key takeaways

- A utility SPA can be real — replace every spoofed number with either a genuine data source or nothing.
- Fake "social proof" is a liability the moment anyone inspects it; honesty is a feature.
- Even a converter should ship a handful of SEO content pages to be discoverable.
- A \`setInterval\` is not a data source — it is a countdown to a credibility problem.
`,
  'mehari-global': `
Mehari Global Solutions is a BPO company site built on Nuxt 4 with \`@nuxtjs/i18n\` (en/am), PWA, and \`nuxt-security\`, backed by a SQLite admin panel for the copy. It is a corporate presence, which means the stakes are different from a tool or a game: here the product is trust, and every inconsistency is a small erosion of it.

This one centered on a rebrand and a localization gap, and the two together taught me more about "identity" in a codebase than any feature work has.

## A brand rename across the whole surface

The company rebranded **Mahari → Mehari**. On the visible surface that is a text swap. Under the hood it is an app-identity change: the Android/iOS bundle id \`com.mahariglobalsolutions.meti\`, the contact email domain, and the Render service name all carried the old spelling, and each has downstream consequences — app-store identity, DNS, and a new Render service on blue-green deploy.

\`\`\`ts
// The rename touches more than a string in a JSON file:
// - bundle id com.mahariglobalsolutions.meti → com.mehariglobalsolutions.meti
// - contact@mahariglobal… → contact@mehariglobal…
// - Render service "mahariglobal" → "mehariglobal" (new blue-green deploy)
\`\`\`

A rename that is only done in the UI leaves the old name alive in places users and app stores actually see, and those are the places a rebrand either sticks or leaks.

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

The tagline had the inverse bug — it was *already* i18n'd, but a DB-backed \`info.tagline\` (a single English value) overrode the localized key, so Amharic visitors still saw English. The header now reads the locale key directly, and the DB value is only used where a single-language override is genuinely intended.

## Render as the host

The site deploys on Render (\`.onrender.com\`). That is fine for an API, but a marketing/corporate site pays for it in cold-start latency and weaker edge caching compared to a static/edge host. The architectural split that makes sense here is the same one the other projects landed on: Cloudflare Pages/Workers for the public site, Render only for the API.

## What I'd do differently

I'd have treated the rename as a migration with a checklist — search every \`bundle\`/domain/service identifier for the old string, not just the visible text — and I'd have made the brand name a locale key from the first line of code so the "hardcoded English logo" bug could never exist. I'd also move the public site off Render onto an edge host, keeping Render only for anything stateful.

## Key takeaways

- A corporate site lives and dies on SEO + trust — the localized brand name is table stakes.
- A rebrand is a migration, not a find-and-replace; identifiers (bundle ids, domains, service names) outlive visible text.
- One source of truth for copy: a DB value that overrides a locale key is a localization bug waiting to surface.
- Missing \`@nuxtjs/seo\` (no sitemap/canonical) is the top remaining fix for a site whose whole job is being found.
`,
  'skilled-trades': `
The Skilled Trades Marketplace connects customers with trade professionals — listings, profiles, and the core flows — with a Vitest unit suite backing the important paths. It is the least flashy project in the folder and, in a real sense, the most important one to get right.

Unlike the marketing sites, this one has accounts, listings, and (eventually) payments. That means the attack surface is orders of magnitude larger, and the mistakes are no longer about rankings — they are about real people's data and money.

## Why the test suite matters first

The one thing this project has that the others lack is a first-class unit suite. That is not a nice-to-have in a marketplace — it is the difference between confidently shipping a change to the listing flow and shipping it on faith:

\`\`\`ts
// tests/unit/listing.spec.ts
import { describe, it, expect } from 'vitest'
import { validateListing } from '~/server/utils/validate'

describe('validateListing', () => {
  it('rejects a listing with a missing trade category', () => {
    expect(validateListing({ title: 'Plumber' })).toEqual({
      valid: false,
      reason: 'category_required',
    })
  })

  it('normalizes a phone number to E.164', () => {
    expect(validateListing({ category: 'plumbing', phone: '(555) 123-4567' }).phone)
      .toBe('+15551234567')
  })
})
\`\`\`

A marketplace has a long tail of these small, critical rules — category whitelists, phone/email normalization, price bounds — and each one is a silent data-quality or security bug if it is only exercised by hand.

## The security surface a marketplace owns

The checklist that matters here is the one the marketing sites never had to think about. Auth, authorization on every listing mutation (IDOR is the classic marketplace bug — "edit listing 123" must check ownership, not just login), and least-privilege database roles:

\`\`\`sql
-- Row-level security: a pro can only read/write their own listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY listing_owner ON listings
  USING (owner_id = current_setting('app.user_id')::uuid)
  WITH CHECK (owner_id = current_setting('app.user_id')::uuid);
\`\`\`

The open item is wiring \`nuxt-security\` plus row-level security end-to-end and confirming least-privilege database roles. A marketplace's attack surface — auth, IDOR on listings, payment flows — is exactly where a missed ownership check costs real users, not just rankings.

## The stack details that still need re-verification

One honest caveat this project carried from its first pass: the dependency scan returned no matched modules, so the stack details need a re-verification before any security claim is made. That is a small, unglamorous task, but it is the prerequisite to every security conclusion above. A security posture built on an unverified dependency list is a posture built on sand.

## What I'd do differently

I'd re-verify the dependency graph first and document exactly what is running, then wire RLS and ownership checks before building any more product surface. The unit suite is the right instinct — the gap is that it does not yet cover the authorization paths, which is where a marketplace actually fails.

## Key takeaways

- A marketplace is the highest-security-stakes project in the folder — audit it first.
- Authorization is not authentication: every mutation must check ownership, or you have IDOR.
- A unit suite is the foundation; make it cover authorization, not just happy-path validation.
- Never trust a security claim that predates a verified dependency list.
`,
  'dice-arena': `
Dice Arena is a 3D dice-roll game prototype built with TresJS (Three.js) on Cloudflare Workers — the most experimental project in the folder, and the one that taught me the most about what "prototype" actually means.

It ships i18n and an edge deployment, and it deliberately does not ship \`nuxt-security\`, PWA, or SEO. That is a defensible position for a prototype and a liability for a launch — and the line between the two is the whole point.

## 3D that ships heavy

A WebGL scene pulls a large bundle and can hurt LCP if it renders eagerly. The right pattern is to lazy-load the scene and gate it behind a user gesture so first paint stays fast:

\`\`\`ts
// Client-only 3D boundary, mounted on demand — not during first paint
const showArena = ref(false)

const Arena = defineAsyncComponent(() =>
  import('~/components/organisms/OArena.vue'),
)
\`\`\`

\`\`\`vue
<template>
  <button v-if="!showArena" @click="showArena = true">
    Roll the dice
  </button>
  <ClientOnly v-else>
    <Arena />
  </ClientOnly>
</template>
\`\`\`

The scene itself is a TresJS \`<TresCanvas>\` with a couple of dice meshes and a physics-ish roll animation. Keeping it behind a click means the initial page is a normal static HTML page with a button, not a WebGL boot.

## A prototype, not a product

It ships i18n and edge deployment but **no \`nuxt-security\`, no PWA, no SEO** — acceptable for a prototype, not for a launch. Before treating it as shipped, the cheap retrofits are \`nuxt-security\` for headers and a sitemap; both are far cheaper now than they will be after the game has players and content.

## Deploying 3D to the edge

The Cloudflare Workers deployment is the quiet win here. A 3D prototype that boots on the edge with Nitro's generated Wrangler config means the static shell and the WebGL asset both get served from close to the player:

\`\`\`toml
# .output/server/wrangler.json (generated)
name = "sh1r00-dice-arena"
compatibility_date = "2025-07-01"
main = "server/index.mjs"
\`\`\`

The lesson that matters is not the config itself — it is that edge deployment and a heavy client bundle are orthogonal concerns, and you can have both if you keep the 3D out of the critical path.

## What I'd do differently

I'd write the "harden before launch" checklist now and treat it as part of the definition of done for the next milestone. Specifically: add \`nuxt-security\`, a sitemap, and a PWA manifest, and gate the 3D scene behind a user gesture from the first commit rather than retrofitting it. A prototype with a hardening checklist attached is a roadmap; a prototype without one is a surprise later.

## Key takeaways

- Prototypes need a "harden before launch" checklist — security + SEO can be added cheaply and later cost much more.
- Keep WebGL out of first paint: lazy-load the scene and gate it behind a user gesture.
- Edge deployment and a heavy client bundle are orthogonal — split them deliberately.
- A prototype's honest state is a feature: label it a prototype until the checklist is done.
`,
}
