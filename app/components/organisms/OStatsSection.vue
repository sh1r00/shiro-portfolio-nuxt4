<script setup lang="ts">
const { t } = useI18n()

const stats = [
  { key: 'projects', value: '16+',  icon: '📦' },
  { key: 'templates', value: '12',  icon: '🎨' },
  { key: 'live',     value: '4',   icon: '🚀' },
  { key: 'languages', value: '3',   icon: '🌐' },
]
</script>

<template>
  <section class="py-16 bg-[var(--md-sys-color-primary-container)]/20">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-center text-2xl md:text-3xl font-bold text-[var(--md-sys-color-on-surface)] mb-12">
        {{ t('stats.title') }}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="stat in stats"
          :key="stat.key"
          class="text-center p-6 rounded-3xl bg-[var(--md-sys-color-surface-container)]"
        >
          <div class="text-3xl mb-2">{{ stat.icon }}</div>
          <div class="text-3xl md:text-4xl font-bold text-[var(--md-sys-color-primary)]">
            {{ stat.value }}
          </div>
          <div class="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1">
            {{ t(`stats.${stat.key}`) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
