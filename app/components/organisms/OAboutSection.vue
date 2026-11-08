<script setup lang="ts">
const { t, locale } = useI18n()
const { content } = useContent()
const { live, templates, upcoming } = useWorks()

const bio = computed(() => locale.value === 'en' && content.value.about_bio
  ? content.value.about_bio
  : t('about.bio'))
const email = computed(() => content.value.contact_email || 'joedoe98210@gmail.com')

const aboutStats = computed(() => [
  { value: String(live.value.length + templates.value.length + upcoming.value.length), key: 'projects' },
  { value: '5', key: 'categories' },
  { value: '3', key: 'languages' },
  { value: '∞', key: 'detail' },
])
</script>

<template>
  <section id="about" class="about-section py-20 md:py-28">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="about-heading">
        <p class="section-eyebrow">{{ t('about.title') }}</p>
        <h2>{{ t('about.subtitle') }}</h2>
      </div>

      <div class="about-panel">
        <div class="about-profile">
          <div class="about-avatar" aria-hidden="true">S</div>
          <div class="about-identity">
            <h3>{{ t('about.name') }}</h3>
            <p>{{ t('about.role') }}</p>
            <div class="about-links">
              <a href="https://github.com/sh1r00" target="_blank" rel="noopener noreferrer">🐙 {{ t('about.github') }} <span aria-hidden="true">↗</span></a>
              <a :href="`mailto:${email}`">📧 {{ t('about.email') }} <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>

        <p class="about-bio">{{ bio }}</p>

        <div class="about-stats">
          <div v-for="s in aboutStats" :key="s.key" class="about-stat">
            <div>{{ s.value }}</div>
            <span>{{ t(`about.stats_${s.key}`) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  background: var(--md-sys-color-surface-container-low);
}

.about-heading {
  max-width: 46rem;
  margin-bottom: 2rem;
}

.about-heading h2 {
  margin-top: 0.75rem;
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.2rem, 4.5vw, 3.8rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1.05;
}

.about-panel {
  overflow: hidden;
  padding: clamp(1.25rem, 4vw, 3rem);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1.5rem;
  background:
    radial-gradient(ellipse at 100% 0, color-mix(in srgb, var(--md-sys-color-primary-container) 55%, transparent), transparent 25rem),
    var(--md-sys-color-surface);
  box-shadow: 0 1.5rem 4rem -3rem color-mix(in srgb, var(--md-sys-color-on-surface) 35%, transparent);
}

.about-profile {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.about-avatar {
  display: grid;
  width: 5rem;
  aspect-ratio: 1;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
  border-radius: 1.4rem;
  background: linear-gradient(145deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  color: white;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2.4rem;
  font-weight: 700;
  box-shadow: 0 0.8rem 1.8rem -1rem var(--md-sys-color-primary);
}

.about-identity h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.about-identity > p {
  margin-top: 0.2rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9rem;
}

.about-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.9rem;
}

.about-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  color: var(--md-sys-color-on-surface);
  font-size: 0.75rem;
  font-weight: 650;
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
}

.about-links a:hover {
  border-color: var(--md-sys-color-primary);
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.about-bio {
  max-width: 58rem;
  margin-top: 2rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.95rem;
  line-height: 1.8;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.about-stat {
  padding: 0 0.75rem;
  text-align: center;
}

.about-stat + .about-stat {
  border-left: 1px solid var(--md-sys-color-outline-variant);
}

.about-stat div {
  color: var(--md-sys-color-primary);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.75rem;
  font-weight: 700;
}

.about-stat span {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.7rem;
}

@media (max-width: 560px) {
  .about-profile {
    align-items: flex-start;
  }

  .about-avatar {
    width: 3.5rem;
    border-radius: 1rem;
    font-size: 1.8rem;
  }

  .about-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.1rem 0;
  }

  .about-stat:nth-child(3) {
    border-left: 0;
  }
}
</style>
