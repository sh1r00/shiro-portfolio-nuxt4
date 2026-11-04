<script setup lang="ts">
const failpoints = [
  { symptom: 'hreflang links silently missing', cause: 'missing `baseUrl` + locale `language` ISO code, and no `useLocaleHead({ seo: true })` merge', fix: 'add config + merge into `useHead` in `app.vue`' },
  { symptom: 'EBUSY: rmdir `.output/public` on generate', cause: 'shell cwd left inside `.output/public` (Windows file-lock)', fix: '`cd` to repo root, re-run' },
  { symptom: 'Generate failed at Workbox', cause: '5.4 MB self-hosted icon font > 2 MiB precache limit', fix: '`workbox.maximumFileSizeToCacheInBytes: 6 * 1024 * 1024`' },
  { symptom: '500 on every prerendered route', cause: 'universal plugin ran before `pinia.ts` (alphabetical)', fix: '`defineNuxtPlugin({ name, dependsOn: [\'pinia\'] })`' },
  { symptom: 'Hydration mismatch resuming the tour', cause: 'client-only restore flipped `active` before mount', fix: 'universal plugin — `useCookie` reads the request cookie during SSR' },
  { symptom: 'Cannot find module `bcryptjs` on Render', cause: 'split-repo `hapi-server` missing 8 deps', fix: 'deps in `hapi-server/package.json` + `.npmrc` + `.node-version`' },
  { symptom: '`/api` returns SPA HTML', cause: 'static host intercepted `/api/*`', fix: 'Pages Function proxies `/api/*` → Render' },
  { symptom: 'Language selector broken', cause: '`setLocaleCookie` destructured from `useI18n()` = undefined', fix: 'use standalone `useSwitchLocalePath()`' },
  { symptom: 'Infinite redirect crash on `/es/` `/am/`', cause: '`detectBrowserLanguage` truthy default + `/es → /es/` redirects', fix: '`detectBrowserLanguage: false` + no redirect rules' },
  { symptom: '`tm()` over an array crashes SSR', cause: 'vue-i18n v11 compiles array messages differently', fix: 'flat keys + `t()`, never `tm()` a list' },
  { symptom: 'Keyword planner "opens empty"', cause: 'list projection lacks full doc', fix: '`openPlan` fetches `GET /plans/{id}`' },
  { symptom: 'Social scraper "save 400"', cause: 'transient `evidence`/`sources` rejected by schema', fix: 'strip client-side before POST' },
  { symptom: 'Reddit 403', cause: 'datacenter IPs blocked', fix: 'degrade to empty; real data needs OAuth' },
  { symptom: '"Prerender worked" false positive', cause: '`grep -o … | head -1 && echo` (head exits 0)', fix: 'use `grep -c`' },
]

const blueprint = [
  'Scaffold the split repo — Nuxt 4 + a `hapi-server/` sub-package with its own `package.json`/`Procfile`.',
  'Hybrid rendering — SSR on globally, `nitro.prerender` public routes, `routeRules` opt app routes out (`ssr: false, robots: false`).',
  'i18n — `prefix_except_default`, `detectBrowserLanguage: false`, `baseUrl` + `language`/`iso`, `useLocaleHead({ seo: true })`, lockstep test.',
  'API proxy — a Cloudflare Pages Function forwards `/api/*` to Render.',
  'Credit model — one `credits.js` with `COSTS`, atomic deduct + refund, deterministic-only cache.',
  'AI provider — one `ai-provider.js` swap point + a `seeders/` spoof fallback + prompt augmentation.',
  'Observability — one `observability.js` (events → Mongo + threshold email alerting) on Sentry/pino/Prometheus.',
  'Onboarding — spotlight CSS + inline demo data + session-cookie restore, mounted in the default layout.',
  'SEO — `@nuxtjs/seo` + hand-rolled JSON-LD + breadcrumbs + hreflang, verified with `grep -c`.',
  'Ship — push to `master` → Cloudflare Pages auto-deploys; trigger Render deploy for the backend.',
]
</script>

<template>
  <div class="case-study">
    <header class="cs-hero">
      <NuxtLink to="/#works" class="cs-back">← Back to works</NuxtLink>
      <p class="cs-kicker">CASE STUDY</p>
      <h1 class="cs-title">kPhone Marketing</h1>
      <p class="cs-subtitle">An AI marketing campaign generator — how it was built, what broke, and how to rebuild it.</p>
      <div class="cs-meta">
        <span>Nuxt 4 · Vue 3 · Hapi.js · MongoDB · OpenAI · Stripe</span>
        <a href="https://marketing-gen.pages.dev" target="_blank" rel="noopener noreferrer">Live site ↗</a>
      </div>
    </header>

    <section class="cs-section">
      <h2>The problem</h2>
      <p>Keyword research, audience demographics, and content production live in three separate tools (SEMrush, social listening, a human writer). There was no single pipeline that carries <em>one topic</em> through all three and hands back an editable campaign — with transparent, pay-per-run cost. kPhone Marketing closes that gap.</p>
      <div class="cs-pipeline">
        <div><strong>idea</strong><span>→ keywords</span></div>
        <div><strong>keywords</strong><span>→ persona</span></div>
        <div><strong>persona + keywords</strong><span>→ content</span></div>
        <div><strong>content</strong><span>→ campaign</span></div>
      </div>
    </section>

    <section class="cs-section">
      <h2>Architecture — the cross-section</h2>
      <p>A static Nuxt frontend (hybrid SSG + SPA) on Cloudflare Pages, proxying <code>/api/*</code> to a Hapi backend on Render, backed by MongoDB, OpenAI, Google Ads, Stripe, Brevo and Sentry. Two rules shaped everything:</p>
      <ul>
        <li><strong>One-directional hybrid rendering.</strong> <code>ssr: false</code> is a global kill-switch — you can never opt a route back <em>into</em> SSR. Enable SSR globally, then opt app routes <em>out</em>.</li>
        <li><strong>Atomic and auditable.</strong> Credits deduct per request, refund on hard failure, every mutation logged.</li>
      </ul>
    </section>

    <section class="cs-section">
      <h2>How it was built</h2>
      <p>The interesting parts: a credit model where reruns cost the same and failures refund; an in-house observability layer (structured events + threshold email alerting) that replaced a paid SaaS; a single <code>ai-provider.js</code> swap point with a deterministic "spoof" fallback that made offline demoing and a <strong>credit-free onboarding tour</strong> possible.</p>
      <p>The onboarding tour is the standout — a spotlight-guided walkthrough that injects demo data into the <em>real</em> tool UI, so a new user learns by doing without spending a single credit, and it survives a mid-tour language switch.</p>
    </section>

    <section class="cs-section">
      <h2>Failpoints</h2>
      <p>The expensive bugs were the <em>silent</em> ones — things that "worked" while doing nothing.</p>
      <div class="cs-failpoints">
        <div v-for="f in failpoints" :key="f.symptom" class="cs-failpoint">
          <p class="cs-fp-symptom">{{ f.symptom }}</p>
          <p class="cs-fp-cause"><span>Root cause</span> {{ f.cause }}</p>
          <p class="cs-fp-fix"><span>Fix</span> {{ f.fix }}</p>
        </div>
      </div>
    </section>

    <section class="cs-section">
      <h2>Successes</h2>
      <ul>
        <li>Hybrid rendering done right — public content in static HTML, app routes SPA, one build.</li>
        <li>A genuinely atomic credit model with live cost on every button.</li>
        <li>In-house observability replaced a paid SaaS with ~200 lines + existing Sentry/pino/Prometheus.</li>
        <li>115 unit tests, including an i18n lockstep test that makes locale drift fail CI instead of rendering silently.</li>
      </ul>
    </section>

    <section class="cs-section">
      <h2>How to recreate it</h2>
      <ol class="cs-blueprint">
        <li v-for="(step, i) in blueprint" :key="i">{{ step }}</li>
      </ol>
    </section>

    <section class="cs-section">
      <h2>Key lessons</h2>
      <ul>
        <li>The expensive bugs are the silent ones — verify output with counts, not presence checks.</li>
        <li><code>ssr: false</code> is one-way; opt app routes out, never content routes in.</li>
        <li>Cross-package deps are a trap on the deploy host.</li>
        <li>A demo fallback is strategic — as long as you flag what's spoofed.</li>
        <li>Document failures, not just features.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.case-study {
  padding: 8rem 0 6rem;
  background: var(--md-sys-color-surface);
}
.cs-hero {
  max-width: 46rem;
  margin: 0 auto 3rem;
  padding: 0 1.25rem;
}
.cs-back {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--md-sys-color-primary);
  font-size: 0.85rem;
  font-weight: 650;
}
.cs-kicker {
  margin-bottom: 0.5rem;
  color: var(--md-sys-color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.cs-title {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.6rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
}
.cs-subtitle {
  margin-top: 1.25rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.65;
}
.cs-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
}
.cs-meta a {
  color: var(--md-sys-color-primary);
  font-weight: 650;
}
.cs-section {
  max-width: 46rem;
  margin: 0 auto 3rem;
  padding: 0 1.25rem;
}
.cs-section h2 {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
}
.cs-section p {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.75;
  margin-bottom: 1rem;
}
.cs-section ul, .cs-section ol {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.7;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.5rem;
}
.cs-section code {
  padding: 0.1rem 0.35rem;
  border-radius: 0.35rem;
  background: var(--md-sys-color-surface-container-high);
  font-size: 0.85em;
}
.cs-pipeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.cs-pipeline div {
  padding: 1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 0.9rem;
  background: var(--md-sys-color-surface-container-low);
  display: grid;
  gap: 0.35rem;
}
.cs-pipeline strong {
  color: var(--md-sys-color-on-surface);
  font-size: 0.95rem;
}
.cs-pipeline span {
  color: var(--md-sys-color-primary);
  font-size: 0.78rem;
  font-weight: 650;
}
.cs-failpoints {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.cs-failpoint {
  padding: 1rem 1.1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 0.9rem;
  background: var(--md-sys-color-surface-container-low);
}
.cs-fp-symptom {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
  margin-bottom: 0.4rem;
}
.cs-fp-cause, .cs-fp-fix {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.85rem;
  margin: 0.2rem 0;
}
.cs-fp-cause span, .cs-fp-fix span {
  display: inline-block;
  margin-right: 0.4rem;
  color: var(--md-sys-color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
@media (max-width: 640px) {
  .cs-pipeline { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
