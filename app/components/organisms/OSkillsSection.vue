<script setup lang="ts">
const { t } = useI18n()

const skills = [
  { key: 'nuxt',       icon: '🟢' },
  { key: 'm3',         icon: '🎨' },
  { key: 'i18n',       icon: '🌐' },
  { key: 'security',   icon: '🔒' },
  { key: 'github',     icon: '🐙' },
  { key: 'netlify',    icon: '🚀' },
  { key: 'testing',    icon: '🧪' },
  { key: 'ai',         icon: '🤖' },
]
</script>

<template>
  <section id="skills" class="py-20 md:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">
          {{ t('skills.title') }}
        </p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">
          {{ t('skills.subtitle') }}
        </h2>
      </div>

      <!-- Skills grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="skill in skills"
          :key="skill.key"
          class="group p-6 rounded-3xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] hover:border-[var(--md-sys-color-primary)] hover:shadow-lg transition-all duration-300"
        >
          <div class="text-3xl mb-4">{{ skill.icon }}</div>
          <h3 class="text-lg font-bold text-[var(--md-sys-color-on-surface)] mb-2">
            {{ t(`skills.${skill.key}.name`) }}
          </h3>
          <p class="text-sm text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
            {{ t(`skills.${skill.key}.desc`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
