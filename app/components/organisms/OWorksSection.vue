<script setup lang="ts">
const { t } = useI18n()

const templates = [
  { title: 'Savora Restaurant',   url: 'https://restaurant-editable.netlify.app',           thumbnail: '/img/restaurant-editable.png' },
  { title: 'Terra & Flame',       url: 'https://restaurant-horizontal.netlify.app',         thumbnail: '' },
  { title: 'Restaurant Vertical', url: 'https://restaurant-vertical.netlify.app',            thumbnail: '' },
  { title: 'SH1R00 Construction', url: 'https://construct-site-sh1r00-239.netlify.app',      thumbnail: '' },
  { title: 'Realty Creditors',    url: 'https://realty-creditors.netlify.app',               thumbnail: '/img/realty-creditors.png' },
  { title: 'Sh1r00 Digital',      url: 'https://landing-page-sh1r00-946.netlify.app',        thumbnail: '' },
  { title: 'Affiliate Page',      url: 'https://affiliate-page-sh1r00-691.netlify.app',      thumbnail: '' },
  { title: 'Medical Site',        url: 'https://medical-site-sh1r00-972.netlify.app',        thumbnail: '' },
  { title: 'Photography Site',    url: 'https://photo-site-sh1r00-427.netlify.app',          thumbnail: '' },
  { title: 'DevBlog',             url: 'https://your-blog-sh1r00-623.netlify.app',           thumbnail: '/img/your-blog.png' },
  { title: 'Bael Template',       url: 'https://bael-template-sh1r00-814.netlify.app',       thumbnail: '' },
  { title: 'Urban Ride Bikes',    url: 'https://bike-store-sh1r00-817.netlify.app',          thumbnail: '' },
]

const liveProjects = [
  { title: 'Shop Tulu',            url: 'https://shop-tulu.netlify.app',                    thumbnail: '/img/shop-tulu.png' },
  { title: 'kPhone Marketing',     url: 'https://marketing-campaign-gen.netlify.app',       thumbnail: '' },
  { title: 'Credit Wiz',           url: 'https://credit-wizard-sh1r00-229.netlify.app',     thumbnail: '/img/credit-wizard.png' },
  { title: 'Money Conversion SPA', url: 'https://trading-bot-sh1r00-332.netlify.app',       thumbnail: '/img/trading-bot.png' },
]
</script>

<template>
  <section id="works" class="py-20 md:py-32 bg-[var(--md-sys-color-surface-container-low)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">
          {{ t('works.title') }}
        </p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">
          {{ t('works.subtitle') }}
        </h2>
      </div>

      <!-- Live Projects -->
      <div class="mb-16">
        <div class="flex items-center gap-3 mb-8">
          <span class="w-2 h-2 rounded-full bg-[var(--md-sys-color-tertiary)] animate-pulse" />
          <h3 class="text-2xl font-bold text-[var(--md-sys-color-on-surface)]">
            {{ t('works.live_projects') }}
          </h3>
          <span class="text-sm text-[var(--md-sys-color-on-surface-variant)]">
            — {{ t('works.live_projects_desc') }}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MProjectCard
            v-for="project in liveProjects"
            :key="project.title"
            :title="project.title"
            :url="project.url"
            :thumbnail="project.thumbnail || undefined"
            :is-live="true"
          />
        </div>
      </div>

      <!-- Templates -->
      <div>
        <div class="flex items-center gap-3 mb-8">
          <span class="w-2 h-2 rounded-full bg-[var(--md-sys-color-primary)]" />
          <h3 class="text-2xl font-bold text-[var(--md-sys-color-on-surface)]">
            {{ t('works.templates') }}
          </h3>
          <span class="text-sm text-[var(--md-sys-color-on-surface-variant)]">
            — {{ t('works.templates_desc') }}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MProjectCard
            v-for="template in templates"
            :key="template.title"
            :title="template.title"
            :url="template.url"
            :thumbnail="template.thumbnail || undefined"
          />
        </div>
      </div>
    </div>
  </section>
</template>
