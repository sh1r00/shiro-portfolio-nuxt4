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
  security: { ssg: { hashScripts: false } },
  nitro: { prerender: { failOnError: false } },
  runtimeConfig: { public: { baseUrl: '' } },
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
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff2}'],
    },
  },
})
