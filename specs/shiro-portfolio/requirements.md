# shiro-portfolio — Requirements

## Functional requirements

- **FR-1 — Hero**: name/brand ("shiro"), tagline ("where style meets function"), a
  subtitle, two CTAs (view work / explore skills), and headline stats (projects,
  templates, live apps, languages).
- **FR-2 — Skills**: a grid of skill cards (icon, name, description, tag chips).
- **FR-3 — Works (templates + live projects)**: two grids — "Templates" (ready-to-use
  sites) and "Live Projects" (production apps) — each card links out to its deployed URL.
- **FR-4 — Project previews**: a horizontally scrollable screenshot carousel linking to
  live projects.
- **FR-5 — About**: bio, avatar, GitHub + email links, and a stats row.
- **FR-6 — Contact**: a contact section (name / email / message form or mailto link).
- **FR-7 — Navigation**: fixed top nav with section anchors (skills, works, live, about,
  contact), language switcher, and dark-mode toggle; skip-to-content link.
- **FR-8 — Footer**: "Made with ❤️ by shiro" + tagline.

## Non-functional requirements

- **NFR-1 — M3 design**: Material 3 color tokens (`--md-sys-color-*`) generated from a
  single primary (#6C5CE7), light + dark, applied via `material-tokens.css`.
- **NFR-2 — i18n**: 3 locales (en/es/am) via `prefix_except_default`; every string
  localized; `detectBrowserLanguage: false`.
- **NFR-3 — Accessibility**: WCAG 2.1 AA, skip-to-content, semantic HTML, aria labels,
  keyboard navigation, sufficient contrast.
- **NFR-4 — PWA**: offline service worker, install manifest, maskable icons.
- **NFR-5 — Performance**: SSG (prerendered), lazy images, ≥90 Lighthouse (target 98).
- **NFR-6 — Security**: `nuxt-security` headers (CSP, XSS, referrer), no inline scripts.
- **NFR-7 — SEO**: per-locale `canonical` + `hreflang` alternates, dynamic `<html lang>`.
- **NFR-8 — Atomic design**: all UI built bottom-up (A* → M* → O* → page); pages compose
  organisms, never inline markup/data.
- **NFR-9 — Testing**: Vitest unit tests + Playwright E2E, zero console errors.
