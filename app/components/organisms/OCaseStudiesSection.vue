<script setup lang="ts">
import { caseStudies } from '~/data/caseStudies'
</script>

<template>
  <section id="case-studies" class="case-studies-section py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="case-studies-heading">
        <p class="section-eyebrow">CASE STUDIES</p>
        <h2 class="case-studies-title">How each project came together</h2>
        <p class="case-studies-desc">
          Deep dives into the base start, the weaknesses, the fixes, and the lessons behind every build.
        </p>
      </div>

      <div class="case-studies-grid">
        <NuxtLink
          v-for="c in caseStudies"
          :key="c.slug"
          :to="`/blog/${c.slug}`"
          class="case-study-card"
        >
          <h3>{{ c.title }}</h3>
          <p>{{ c.summary }}</p>
          <span class="case-study-card-link">Read the case study <span aria-hidden="true">↗</span></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-studies-section {
  background: var(--md-sys-color-surface);
}

.case-studies-heading {
  max-width: 46rem;
  margin-bottom: 3rem;
}

.case-studies-title {
  margin-top: 0.75rem;
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 1;
  text-wrap: balance;
}

.case-studies-desc {
  margin-top: 1.1rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  line-height: 1.6;
}

.case-studies-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.case-study-card {
  display: grid;
  gap: 0.6rem;
  align-content: start;
  padding: 1.5rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1.25rem;
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.case-study-card:hover {
  border-color: var(--md-sys-color-primary);
  transform: translateY(-3px);
  box-shadow: 0 1.5rem 3rem -2rem color-mix(in srgb, var(--md-sys-color-on-surface) 35%, transparent);
}

.case-study-card h3 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.case-study-card p {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9rem;
  line-height: 1.6;
}

.case-study-card-link {
  margin-top: 0.4rem;
  color: var(--md-sys-color-primary);
  font-size: 0.82rem;
  font-weight: 650;
}

@media (max-width: 640px) {
  .case-studies-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
