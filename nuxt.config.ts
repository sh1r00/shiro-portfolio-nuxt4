import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@vite-pwa/nuxt', 'nuxt-security'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'am', iso: 'am-ET', name: 'አማርኛ', file: 'am.json' },
    ],
    detectBrowserLanguage: false,
    lazy: true,
    langDir: 'locales',
  },
  security: {
    ssg: { hashScripts: false },
    // xssValidator breaks POST bodies (escapeHtml TypeError on any POST) — inputs are
    // validated server-side instead. csrf off: the admin session cookie is SameSite=lax,
    // which blocks cross-site POST (the primary CSRF vector for a single-user admin).
    xssValidator: false,
    csrf: false,
  },
  nitro: {
    prerender: { failOnError: false },
    // @libsql/client ships a native/WASM libsql binding for `file:` mode — don't bundle it.
    externals: { external: ['@libsql/client', 'libsql'] },
  },
  runtimeConfig: {
    adminSecret: '', // NUXT_ADMIN_SECRET (32+ chars) — session signing
    public: { baseUrl: '' },
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    devOptions: { enabled: false },
    manifest: {
      name: 'shiro — Portfolio',
      short_name: 'shiro',
      description: 'shiro, where style meets function',
      theme_color: '#6C5CE7',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: 'icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // SSR has no precached index.html — a navigateFallback to "/" would throw
      // "non-precached-url" and blank the page. Disable navigation fallback so the
      // server renders every route; the SW only precaches static assets.
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,png,svg,ico,webp,woff2}'],
    },
  },
})
