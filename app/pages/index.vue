<script setup lang="ts">
import { useDarkModeStore } from '~/stores/darkMode'

const darkModeStore = useDarkModeStore()
const isDark = computed(() => darkModeStore.isDark)
const route = useRoute()

onMounted(() => {
  if (typeof window !== 'undefined') {
    darkModeStore.initialize()
  }
})

useHead({
  title: 'shiro — where style meets function',
  meta: [{ name: 'description', content: 'Full-stack web development portfolio — Nuxt 4, Vue 3, M3 Design, 16+ projects deployed' }],
  htmlAttrs: { lang: 'en' }
})

const skills = [
  { icon: '⚡', name: 'Nuxt 4 & Vue 3', desc: 'Full Nuxt 4 migration — SSR/SSG, Pinia, composable patterns, i18n with 3 locales (en/es/am). compatibilityVersion 4 across 16 projects.', tags: ['Nuxt 4','Vue 3','TypeScript','SSR','SSG','Pinia'] },
  { icon: '🎨', name: 'M3 Design System', desc: 'Material Design 3 atomic components — atoms, molecules, organisms. Viral M3 aesthetics framework with 6 psychological principles scored ≥7/10.', tags: ['M3','Tailwind','Dark Mode','Design Tokens','Atomic Design'] },
  { icon: '🌐', name: 'i18n & Accessibility', desc: '3 locales (en/es/am), WCAG compliant, skip-to-content, aria labels, semantic HTML, keyboard navigation.', tags: ['i18n','a11y','WCAG','RTL','ARIA'] },
  { icon: '🔒', name: 'Security & PWA', desc: 'CSP headers, XSS protection, rate limiting, offline-first PWA with service workers, install prompts, manifest configuration.', tags: ['CSP','PWA','Service Worker','SSL','XSS'] },
  { icon: '🚀', name: 'GitHub & CI/CD', desc: 'Batch repo management across 16+ repositories, SSH authentication, automated deployments, GitHub Actions, multi-repo orchestration.', tags: ['GitHub','Git','SSH','CI/CD','Actions'] },
  { icon: '☁️', name: 'Netlify & Heroku', desc: 'Static site deployment at scale — API zip uploads, build configuration, DNS management. Hapi.js Node.js backends on Heroku.', tags: ['Netlify','Heroku','CDN','DNS','API'] },
  { icon: '🧪', name: 'Testing & QA', desc: 'Vitest unit tests, Playwright E2E, component testing with happy-dom, dark mode SSR-safe testing, zero-console-error quality gates.', tags: ['Vitest','Playwright','Unit','E2E','Happy-DOM'] },
  { icon: '🤖', name: 'AI Agent Automation', desc: 'Hermes Agent skills for batch project execution, autonomous workflows, multi-agent delegation, cron-based monitoring.', tags: ['Hermes','Skills','Cron','Delegation','Agents'] },
  { icon: '📦', name: 'Hapi.js Backend', desc: 'Hapi.js plugin architecture — auth, campaigns, photos, OpenAI, GoogleAds, S3, SocialScraper, KeywordPlanner. MongoDB Atlas with SRV URI fixes.', tags: ['Hapi.js','Node.js','MongoDB','REST','CORS','JWT'] },
  { icon: '🗄️', name: 'MongoDB & CMS', desc: 'MongoDB Atlas connection management, Strapi CMS integration, Shopify API proxy, Nuxt Content CMS for markdown-driven blogs.', tags: ['MongoDB','Strapi','Shopify','Nuxt Content','Atlas'] },
  { icon: '🔌', name: 'API Integrations', desc: 'Shopify GraphQL Storefront API, OpenAI GPT-4, Google Ads API, AWS S3, Facebook Graph API, Twilio SMS, Stripe payments.', tags: ['Shopify','OpenAI','AWS S3','GoogleAds','Stripe','Twilio'] },
  { icon: '⚙️', name: 'DevOps & Tooling', desc: 'dotenvx-encrypted env management, git credential handling, ssh-keygen, npm/npx automation, node version management, batch shell scripting.', tags: ['dotenvx','SSH','npm','Shell','Node.js','Batch'] },
]

const templates = [
  { name: 'Savora Restaurant', desc: 'Fine dining — menu, gallery, reservations', url: 'https://restaurant-editable.netlify.app', img: '/img/restaurant-editable.png', emoji: '🍽️' },
  { name: 'Terra & Flame', desc: 'Modern rustic dining, wood-fired theme', url: 'https://restaurant-horizontal.netlify.app', img: '', emoji: '🔥' },
  { name: 'Restaurant Vertical', desc: 'Vertical-scroll restaurant layout', url: 'https://restaurant-vertical.netlify.app', img: '', emoji: '🍷' },
  { name: 'SH1R00 Construction', desc: 'Construction portfolio, services, blog', url: 'https://construct-site-sh1r00-239.netlify.app', img: '', emoji: '🏗️' },
  { name: 'Realty Creditors', desc: 'Real estate financing, multi-step forms', url: 'https://realty-creditors.netlify.app', img: '/img/realty-creditors.png', emoji: '🏠' },
  { name: 'Sh1r00 Digital', desc: 'Agency landing, pricing, team, testimonials', url: 'https://landing-page-sh1r00-946.netlify.app', img: '', emoji: '🚀' },
  { name: 'Affiliate Page', desc: 'Video-first affiliate, pricing, FAQs', url: 'https://affiliate-page-sh1r00-691.netlify.app', img: '', emoji: '📈' },
  { name: 'Medical Site', desc: 'Healthcare practice, services, doctors', url: 'https://medical-site-sh1r00-972.netlify.app', img: '', emoji: '🏥' },
  { name: 'Photography Site', desc: 'Portfolio, gallery, booking system', url: 'https://photo-site-sh1r00-427.netlify.app', img: '', emoji: '📸' },
  { name: 'DevBlog', desc: 'Markdown blog, categories, tags, search', url: 'https://your-blog-sh1r00-623.netlify.app', img: '/img/your-blog.png', emoji: '📝' },
  { name: 'Bael Template', desc: 'Brutalist design blog, typography-first', url: 'https://bael-template-sh1r00-814.netlify.app', img: '', emoji: '✒️' },
  { name: 'Urban Ride Bikes', desc: 'E-commerce bike store, cart, search', url: 'https://bike-store-sh1r00-817.netlify.app', img: '', emoji: '🚲' },
]

const liveProjects = [
  { name: 'Shop Tulu', desc: 'Full Shopify-integrated e-commerce PWA', url: 'https://shop-tulu.netlify.app', img: '/img/shop-tulu.png', emoji: '🛒' },
  { name: 'kPhone Marketing', desc: 'AI-powered campaign generator, Hapi.js backend + Nuxt 4 frontend', url: 'https://marketing-campaign-gen.netlify.app', img: '', emoji: '📊' },
  { name: 'Credit Wiz', desc: 'Loan application platform, lender matching', url: 'https://credit-wizard-sh1r00-229.netlify.app', img: '/img/credit-wizard.png', emoji: '💳' },
  { name: 'Money Conversion SPA', desc: 'Curated money-making resources, income calculator', url: 'https://trading-bot-sh1r00-332.netlify.app', img: '/img/trading-bot.png', emoji: '💰' },
]

const screenshots = [
  { name: 'Savora Restaurant', label: 'Fine Dining — Template', img: '/img/restaurant-editable.png', url: 'https://restaurant-editable.netlify.app' },
  { name: 'Realty Creditors', label: 'Real Estate — Template', img: '/img/realty-creditors.png', url: 'https://realty-creditors.netlify.app' },
  { name: 'DevBlog', label: 'Technical Blog — Template', img: '/img/your-blog.png', url: 'https://your-blog-sh1r00-623.netlify.app' },
  { name: 'Shop Tulu', label: 'E-Commerce — Live', img: '/img/shop-tulu.png', url: 'https://shop-tulu.netlify.app' },
  { name: 'Credit Wiz', label: 'FinTech — Live', img: '/img/credit-wizard.png', url: 'https://credit-wizard-sh1r00-229.netlify.app' },
  { name: 'Trading Bot', label: 'Finance Tools — Live', img: '/img/trading-bot.png', url: 'https://trading-bot-sh1r00-332.netlify.app' },
]
</script>

<template>
  <a href="#main-content" class="skip-to-content">Skip to main content</a>

  <header class="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-baseline gap-2">
        <span class="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">shiro</span>
        <span class="text-xs text-on-surface-variant hidden sm:inline">where style meets function</span>
      </div>
      <nav class="hidden md:flex gap-6 items-center">
        <a href="#skills" class="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Skills</a>
        <a href="#templates" class="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Templates</a>
        <a href="#live" class="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Live</a>
        <a href="#about" class="text-sm text-on-surface-variant hover:text-on-surface transition-colors">About</a>
        <button @click="darkModeStore.toggle()" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors" aria-label="Toggle dark mode">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </nav>
    </div>
  </header>

  <main id="main-content" tabindex="-1">
    <!-- Hero -->
    <section class="min-h-screen flex items-center relative overflow-hidden pt-16">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-400/5" />
      <div class="max-w-6xl mx-auto px-6 relative z-10 py-20">
        <div class="inline-block px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold mb-6">🚀 Web Development Studio</div>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6 max-w-4xl">
          Crafting <span class="text-primary">Digital</span> Experiences That Convert
        </h1>
        <p class="text-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
          Full-stack web development specializing in Nuxt 4, Vue 3, Hapi.js, and modern Jamstack architecture. From restaurant sites to fintech dashboards — every project built with performance, accessibility, and viral aesthetics.
        </p>
        <div class="flex gap-4 flex-wrap">
          <a href="#templates" class="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity">View Our Work</a>
          <a href="#skills" class="px-6 py-3 rounded-lg border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors">Explore Skills</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div class="text-center"><div class="text-3xl font-black text-primary">16+</div><div class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">Projects</div></div>
          <div class="text-center"><div class="text-3xl font-black text-primary">12</div><div class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">Templates</div></div>
          <div class="text-center"><div class="text-3xl font-black text-primary">4</div><div class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">Live Apps</div></div>
          <div class="text-center"><div class="text-3xl font-black text-primary">3</div><div class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">Languages</div></div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12"><h2 class="text-3xl font-black tracking-tight">What We Do</h2><p class="text-on-surface-variant mt-2">End-to-end expertise from architecture to deployment — everything needed to ship production-grade web applications.</p></div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="s in skills" :key="s.name" class="p-6 rounded-xl bg-surface-container border border-outline-variant hover:border-primary transition-colors group">
            <div class="text-2xl mb-3">{{ s.icon }}</div><h3 class="font-bold mb-2">{{ s.name }}</h3><p class="text-sm text-on-surface-variant leading-relaxed mb-3">{{ s.desc }}</p>
            <div class="flex flex-wrap gap-1.5"><span v-for="t in s.tags" :key="t" class="px-2 py-0.5 rounded-full bg-surface-variant text-xs text-on-surface-variant">{{ t }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Live -->
    <section id="live" class="py-20 bg-surface-container-low">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12"><h2 class="text-3xl font-black tracking-tight">Live Projects</h2><p class="text-on-surface-variant mt-2">Custom-built applications deployed in production with real users.</p></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <a v-for="p in liveProjects" :key="p.name" :href="p.url" target="_blank" class="group rounded-xl bg-surface-container border border-outline-variant overflow-hidden hover:border-primary hover:-translate-y-1 transition-all">
            <div class="h-56 overflow-hidden bg-surface-variant"><img v-if="p.img" :src="p.img" :alt="p.name" class="w-full h-full object-cover" loading="lazy" /><div v-else class="w-full h-full flex items-center justify-center text-6xl">{{ p.emoji }}</div></div>
            <div class="p-5"><span class="text-[10px] font-bold uppercase tracking-wider text-white bg-green-600 px-2 py-0.5 rounded-full">Live</span><h3 class="font-bold mt-2 text-lg">{{ p.name }}</h3><p class="text-sm text-on-surface-variant mt-1">{{ p.desc }}</p></div>
          </a>
        </div>
      </div>
    </section>

    <!-- Templates -->
    <section id="templates" class="py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12"><h2 class="text-3xl font-black tracking-tight">Templates</h2><p class="text-on-surface-variant mt-2">Production-ready Nuxt 4 templates — dark mode, i18n, PWA, and atomic design across 5 categories.</p></div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a v-for="p in templates" :key="p.name" :href="p.url" target="_blank" class="group rounded-xl bg-surface-container border border-outline-variant overflow-hidden hover:border-primary hover:-translate-y-1 transition-all">
            <div class="h-48 overflow-hidden bg-surface-variant"><img v-if="p.img" :src="p.img" :alt="p.name" class="w-full h-full object-cover" loading="lazy" /><div v-else class="w-full h-full flex items-center justify-center text-4xl">{{ p.emoji }}</div></div>
            <div class="p-4"><span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-container px-2 py-0.5 rounded-full">Template</span><h3 class="font-bold mt-2">{{ p.name }}</h3><p class="text-xs text-on-surface-variant mt-1">{{ p.desc }}</p></div>
          </a>
        </div>
      </div>
    </section>

    <!-- Preview Carousel -->
    <section id="preview" class="py-20 bg-surface-container-low">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12"><h2 class="text-3xl font-black tracking-tight">Project Previews</h2><p class="text-on-surface-variant mt-2">Quick look at some of our live projects. Scroll through to preview.</p></div>
        <div class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4" style="scrollbar-width:none">
          <div v-for="s in screenshots" :key="s.name" class="flex-none w-80 md:w-96 snap-start rounded-xl overflow-hidden relative"><a :href="s.url" target="_blank"><img :src="s.img" :alt="s.name" class="w-full h-56 object-cover" loading="lazy" /><div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4"><h4 class="text-white font-bold">{{ s.name }}</h4><span class="text-white/80 text-xs">{{ s.label }}</span></div></a></div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12"><h2 class="text-3xl font-black tracking-tight">About shiro</h2><p class="text-on-surface-variant mt-2">One developer. 16+ projects. Endless passion for clean code and beautiful design.</p></div>
        <div class="max-w-3xl mx-auto">
          <div class="rounded-2xl bg-surface-container border border-outline-variant p-8 md:p-12">
            <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white text-3xl font-black shrink-0">S</div>
              <div class="text-center md:text-left">
                <h3 class="text-2xl font-black">sh1r00</h3>
                <p class="text-on-surface-variant mt-1">Full-Stack Developer & Design Engineer</p>
                <div class="flex gap-3 mt-4 justify-center md:justify-start">
                  <a href="https://github.com/sh1r00" target="_blank" class="px-4 py-2 rounded-lg bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all text-sm font-semibold">🐙 GitHub</a>
                  <a href="mailto:rasisg@gmail.com" class="px-4 py-2 rounded-lg bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all text-sm font-semibold">📧 Email</a>
                </div>
              </div>
            </div>
            <p class="text-on-surface-variant leading-relaxed mt-8">
              shiro is a solo full-stack developer specializing in Nuxt 4, Vue 3, Hapi.js, and M3 Design. With 16+ projects deployed across Netlify and Heroku, every site is built with performance-first architecture, viral aesthetics, accessibility compliance, and zero-console-error quality gates. From restaurant fine-dining templates to fintech dashboards, from e-commerce PWAs to AI-powered marketing generators — shiro delivers production-ready code that converts.
            </p>
            <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div class="p-4 rounded-xl bg-surface"><div class="text-2xl font-black text-primary">16+</div><div class="text-xs text-on-surface-variant mt-1">Projects Deployed</div></div>
              <div class="p-4 rounded-xl bg-surface"><div class="text-2xl font-black text-primary">5</div><div class="text-xs text-on-surface-variant mt-1">Project Categories</div></div>
              <div class="p-4 rounded-xl bg-surface"><div class="text-2xl font-black text-primary">3</div><div class="text-xs text-on-surface-variant mt-1">Languages</div></div>
              <div class="p-4 rounded-xl bg-surface"><div class="text-2xl font-black text-primary">∞</div><div class="text-xs text-on-surface-variant mt-1">Attention to Detail</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="py-12 border-t border-outline-variant text-center">
    <p class="text-sm text-on-surface-variant">Made with ❤️ by <strong>shiro</strong></p>
    <p class="text-xs text-on-surface-variant mt-1">where style meets function</p>
  </footer>
</template>
