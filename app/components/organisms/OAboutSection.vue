<script setup lang="ts">
const { t } = useI18n()

const aboutStats = [
  { value: '16+', key: 'projects' },
  { value: '5', key: 'categories' },
  { value: '3', key: 'languages' },
  { value: '∞', key: 'detail' },
]
</script>

<template>
  <section id="about" class="py-20 md:py-32">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">{{ t('about.title') }}</p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">{{ t('about.subtitle') }}</h2>
      </div>

      <ACard variant="filled" padding="lg" class="md:p-12">
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] flex items-center justify-center text-white text-3xl font-black shrink-0">S</div>
          <div class="text-center md:text-left">
            <h3 class="text-2xl font-black text-[var(--md-sys-color-on-surface)]">{{ t('about.name') }}</h3>
            <p class="text-[var(--md-sys-color-on-surface-variant)] mt-1">{{ t('about.role') }}</p>
            <div class="flex gap-3 mt-4 justify-center md:justify-start">
              <a href="https://github.com/sh1r00" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] transition-all text-sm font-semibold">🐙 {{ t('about.github') }}</a>
              <a href="mailto:rasisg@gmail.com" class="px-4 py-2 rounded-lg bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] transition-all text-sm font-semibold">📧 {{ t('about.email') }}</a>
            </div>
          </div>
        </div>

        <p class="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed mt-8">{{ t('about.bio') }}</p>

        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <ACard v-for="s in aboutStats" :key="s.key" variant="filled" padding="sm" class="bg-[var(--md-sys-color-surface)]">
            <div class="text-2xl font-black text-[var(--md-sys-color-primary)]">{{ s.value }}</div>
            <div class="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1">{{ t(`about.stats_${s.key}`) }}</div>
          </ACard>
        </div>
      </ACard>
    </div>
  </section>
</template>
