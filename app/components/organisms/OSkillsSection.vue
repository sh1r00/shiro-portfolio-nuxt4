<script setup lang="ts">
const { t } = useI18n()

const skills = [
  { key: 'nuxt', icon: 'layers' },
  { key: 'm3', icon: 'palette' },
  { key: 'i18n', icon: 'language' },
  { key: 'security', icon: 'lock' },
  { key: 'github', icon: 'code' },
  { key: 'netlify', icon: 'rocket_launch' },
  { key: 'testing', icon: 'science' },
  { key: 'ai', icon: 'smart_toy' },
]
</script>

<template>
  <section id="skills" class="py-20 md:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">{{ t('skills.title') }}</p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">{{ t('skills.subtitle') }}</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ACard v-for="skill in skills" :key="skill.key" variant="outlined" padding="md" hover class="group">
          <div class="mb-4"><AIcon :name="skill.icon" size="lg" /></div>
          <h3 class="text-lg font-bold text-[var(--md-sys-color-on-surface)] mb-2">{{ t(`skills.${skill.key}.name`) }}</h3>
          <p class="text-sm text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">{{ t(`skills.${skill.key}.desc`) }}</p>
        </ACard>
      </div>
    </div>
  </section>
</template>
