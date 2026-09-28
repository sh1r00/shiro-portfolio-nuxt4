# shiro-portfolio — Design

## Architecture

- **Nuxt 4, SSG** (`nuxi generate` → `.output/public`), prerendered to static HTML for
  `/`, `/es/`, `/am/`, plus `200.html`/`404.html`.
- **Modules**: `@pinia/nuxt`, `@nuxtjs/i18n`, `@vite-pwa/nuxt`, `nuxt-security`, `@nuxtjs/seo`,
  Tailwind v4 (`@tailwindcss/vite`).
- **No backend** — all content is static (arrays in the page, or a future content file).

## M3 token pipeline

- `scripts/generate-theme.mjs` computes an HCT/OKLab tonal palette for `#6C5CE7` and
  writes `app/assets/css/material-tokens.css` (light `:root` + `.dark`). Regenerate with
  `npm run generate:theme`; **never hand-edit the generated file**.
- `app/assets/css/main.css` consumes the tokens + Tailwind utilities.
- Secondary `#625B71`, tertiary `#7D5260`, error `#B3261E`, neutral + neutral-variant
  palettes are derived from the primary hue.

## Component structure (M3 atomic)

```
app/components/
  atoms/        AButton, ACard, AImage, AText, ALink, ABadge, AIcon
  molecules/    MLanguageSwitcher, MProjectCard
  organisms/    ONavbar, OHeroSection, OSkillsSection, OWorksSection,
                OScreenshotsCarousel, OStatsSection, OContactSection, OFooter
```

The page (`app/pages/index.vue`) **composes** these organisms. Each organism owns one
section (markup + its data), so the page stays a thin composer.

## State

- `app/stores/darkMode.ts` — Pinia store; persists via `useCookie('darkMode')` and toggles
  the `.dark` class on `<html>`.

## i18n strategy

- `strategy: 'prefix_except_default'`, `defaultLocale: 'en'`, locales `en`/`es`/`am`.
- `detectBrowserLanguage: false` (explicit selector only — avoids the redirect-loop crash).
- Locale switched via the `MLanguageSwitcher` (or a raw `<select v-model="locale">` that
  drives `useSwitchLocalePath`/`setLocale`).
