<script setup lang="ts">
import { caseStudies, caseStudyBySlug } from '~/data/caseStudies'

const route = useRoute()
const cs = computed(() => caseStudyBySlug(String(route.params.slug)))

useSeoMeta({
  title: () => (cs.value ? `${cs.value.title} — Case Study` : 'Case Study'),
  description: () => cs.value?.summary || 'Project case study',
})

const others = computed(() => caseStudies.filter(c => c.slug !== cs.value?.slug))
</script>

<template>
  <div v-if="cs" class="case-study">
    <header class="cs-hero">
      <NuxtLink to="/#works" class="cs-back">← Back to works</NuxtLink>
      <p class="cs-kicker">CASE STUDY</p>
      <h1 class="cs-title">{{ cs.title }}</h1>
      <p class="cs-subtitle">{{ cs.summary }}</p>
      <div class="cs-meta">
        <span>{{ cs.stack }}</span>
        <a :href="cs.url" target="_blank" rel="noopener noreferrer">Live site ↗</a>
      </div>
    </header>

    <section class="cs-section">
      <h2>Base start</h2>
      <p>{{ cs.baseStart }}</p>
    </section>

    <section class="cs-section">
      <h2>Weaknesses</h2>
      <ul>
        <li v-for="w in cs.weaknesses" :key="w">{{ w }}</li>
      </ul>
    </section>

    <section class="cs-section">
      <h2>Fixes</h2>
      <ul>
        <li v-for="f in cs.fixes" :key="f">{{ f }}</li>
      </ul>
    </section>

    <section class="cs-section">
      <h2>Problems & how they were fixed</h2>
      <div class="cs-failpoints">
        <div v-for="p in cs.problems" :key="p.problem" class="cs-failpoint">
          <p class="cs-fp-symptom">{{ p.problem }}</p>
          <p class="cs-fp-fix"><span>Fix</span> {{ p.fix }}</p>
        </div>
      </div>
    </section>

    <section v-if="cs.lessons.length" class="cs-section">
      <h2>Lessons</h2>
      <ul>
        <li v-for="l in cs.lessons" :key="l">{{ l }}</li>
      </ul>
    </section>

    <section class="cs-section">
      <h2>More case studies</h2>
      <div class="cs-more">
        <NuxtLink v-for="o in others" :key="o.slug" :to="`/case-study/${o.slug}`" class="cs-more-card">
          <span class="cs-more-title">{{ o.title }}</span>
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </section>
  </div>

  <div v-else class="cs-notfound">
    <p class="cs-kicker">CASE STUDY</p>
    <h1 class="cs-title">Not found</h1>
    <p class="cs-subtitle">No case study matches that slug.</p>
    <NuxtLink to="/#works" class="cs-back">← Back to works</NuxtLink>
  </div>
</template>

<style scoped>
.case-study {
  padding: 8rem 0 6rem;
  background: var(--md-sys-color-surface);
}
.cs-hero {
  max-width: 46rem;
  margin: 0 auto 3rem;
  padding: 0 1.25rem;
}
.cs-back {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--md-sys-color-primary);
  font-size: 0.85rem;
  font-weight: 650;
}
.cs-kicker {
  margin-bottom: 0.5rem;
  color: var(--md-sys-color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.cs-title {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.6rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
}
.cs-subtitle {
  margin-top: 1.25rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.65;
}
.cs-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
}
.cs-meta a { color: var(--md-sys-color-primary); font-weight: 650; }
.cs-section {
  max-width: 46rem;
  margin: 0 auto 3rem;
  padding: 0 1.25rem;
}
.cs-section h2 {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
}
.cs-section p {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.75;
  margin-bottom: 1rem;
}
.cs-section ul {
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.7;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.5rem;
}
.cs-failpoints { display: grid; gap: 0.75rem; margin-top: 1.25rem; }
.cs-failpoint {
  padding: 1rem 1.1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 0.9rem;
  background: var(--md-sys-color-surface-container-low);
}
.cs-fp-symptom { color: var(--md-sys-color-on-surface); font-weight: 700; margin-bottom: 0.4rem; }
.cs-fp-fix { color: var(--md-sys-color-on-surface-variant); font-size: 0.85rem; margin: 0; }
.cs-fp-fix span {
  display: inline-block;
  margin-right: 0.4rem;
  color: var(--md-sys-color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.cs-more { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1.25rem; }
.cs-more-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 0.9rem;
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  font-weight: 650;
  transition: border-color 180ms ease, background 180ms ease;
}
.cs-more-card:hover { border-color: var(--md-sys-color-primary); }
.cs-more-card span:last-child { color: var(--md-sys-color-primary); }
.cs-notfound { max-width: 46rem; margin: 0 auto; padding: 10rem 1.25rem; }
@media (max-width: 640px) {
  .cs-more { grid-template-columns: minmax(0, 1fr); }
}
</style>
