<script setup lang="ts">
const { t } = useI18n()

const skills = [
  { key: 'nuxt', icon: 'layers' },
  { key: 'm3', icon: 'palette' },
  { key: 'i18n', icon: 'language' },
  { key: 'backend', icon: 'storage' },
  { key: 'payments', icon: 'payments' },
  { key: 'security', icon: 'lock' },
  { key: 'ai', icon: 'smart_toy' },
  { key: 'cloud', icon: 'cloud' },
]
</script>

<template>
  <section id="skills" class="skills-section py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="skills-heading">
        <p class="section-eyebrow">{{ t('skills.title') }}</p>
        <h2>{{ t('skills.subtitle') }}</h2>
      </div>

      <div class="skills-grid">
        <article v-for="(skill, index) in skills" :key="skill.key" class="skill-card group">
          <div class="skill-card-top">
            <span class="skill-icon"><AIcon :name="skill.icon" size="md" /></span>
            <span class="skill-number">{{ String(index + 1).padStart(2, '0') }}</span>
          </div>
          <h3>{{ t(`skills.${skill.key}.name`) }}</h3>
          <p>{{ t(`skills.${skill.key}.desc`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section {
  background: var(--md-sys-color-surface);
}

.skills-heading {
  max-width: 45rem;
  margin-bottom: 2.5rem;
}

.skills-heading h2 {
  margin-top: 0.75rem;
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.3rem, 4.7vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1.04;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.skill-card {
  min-width: 0;
  padding: clamp(1.1rem, 2vw, 1.6rem);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1rem;
  background: var(--md-sys-color-surface-container-low);
  transition: transform 200ms ease, background 200ms ease, border-color 200ms ease;
}

.skill-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--md-sys-color-primary) 45%, var(--md-sys-color-outline-variant));
  background: var(--md-sys-color-surface-container);
}

.skill-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.4rem;
}

.skill-icon {
  display: grid;
  width: 2.6rem;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 0.8rem;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.skill-number {
  color: var(--md-sys-color-outline);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.skill-card h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: -0.025em;
}

.skill-card p {
  margin-top: 0.65rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8rem;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .skills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
