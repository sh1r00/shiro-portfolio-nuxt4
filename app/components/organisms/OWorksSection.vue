<script setup lang="ts">
const { t } = useI18n()
const { live, templates } = useWorks()
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
            v-for="project in live"
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
