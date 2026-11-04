<script setup lang="ts">
import { caseStudies } from '~/data/caseStudies'

useSeoMeta({
  title: 'Case Studies — Blog',
  description: 'In-depth case studies of every project — base start, weaknesses, fixes, and lessons learned.',
})
</script>

<template>
  <div class="blog">
    <header class="blog-hero">
      <NuxtLink to="/#works" class="blog-back">← Back to works</NuxtLink>
      <p class="blog-kicker">BLOG</p>
      <h1 class="blog-title">Case studies</h1>
      <p class="blog-subtitle">
        Deep dives into how each project was built — the base start, the weaknesses, the fixes,
        and the problems we hit along the way.
      </p>
    </header>

    <div class="blog-grid">
      <NuxtLink v-for="c in caseStudies" :key="c.slug" :to="`/blog/${c.slug}`" class="blog-card">
        <h2>{{ c.title }}</h2>
        <p>{{ c.summary }}</p>
        <span class="blog-card-stack">{{ c.stack }}</span>
        <span class="blog-card-link">Read the case study ↗</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.blog {
  padding: 8rem 0 6rem;
  background: var(--md-sys-color-surface);
}
.blog-hero {
  max-width: 46rem;
  margin: 0 auto 3rem;
  padding: 0 1.25rem;
}
.blog-back {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--md-sys-color-primary);
  font-size: 0.85rem;
  font-weight: 650;
}
.blog-kicker {
  margin-bottom: 0.5rem;
  color: var(--md-sys-color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.blog-title {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.6rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
}
.blog-subtitle {
  margin-top: 1.25rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  line-height: 1.65;
}
.blog-grid {
  max-width: 60rem;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: grid;
  gap: 1rem;
}
.blog-card {
  display: grid;
  gap: 0.6rem;
  padding: 1.5rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1.25rem;
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}
.blog-card:hover {
  border-color: var(--md-sys-color-primary);
  transform: translateY(-3px);
  box-shadow: 0 1.5rem 3rem -2rem color-mix(in srgb, var(--md-sys-color-on-surface) 35%, transparent);
}
.blog-card h2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.blog-card p {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.92rem;
  line-height: 1.6;
}
.blog-card-stack {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
}
.blog-card-link {
  color: var(--md-sys-color-primary);
  font-size: 0.82rem;
  font-weight: 650;
}
</style>
