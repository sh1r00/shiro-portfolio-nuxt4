<script setup lang="ts">
const { t } = useI18n()
const { live, templates, upcoming } = useWorks()
function isMarketingGenUrl(url: string) {
  try {
    return new URL(url).hostname.toLowerCase() === 'marketing-gen.pages.dev'
  } catch {
    return false
  }
}

const featuredProject = computed(() =>
  live.value.find(project => isMarketingGenUrl(project.url)) || live.value[0],
)
const isMarketingGenFeatured = computed(() => featuredProject.value
  ? isMarketingGenUrl(featuredProject.value.url)
  : false)
const otherProjects = computed(() => live.value.filter(project => project.id !== featuredProject.value?.id))
</script>

<template>
  <section id="works" class="works-section py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="works-heading">
        <div>
          <p class="section-eyebrow">
          {{ t('works.title') }}
          </p>
          <h2 class="section-heading">
            {{ t('works.subtitle') }}
          </h2>
        </div>
        <p class="works-count">
          <span>{{ live.length }}</span>
          {{ t('works.live_projects') }}
        </p>
      </div>

      <div class="mb-16">
        <div class="works-subheading">
          <span class="works-live-mark" aria-hidden="true" />
          <h3>
            {{ t('works.live_projects') }}
          </h3>
          <p>{{ t('works.live_projects_desc') }}</p>
        </div>

        <div v-if="featuredProject" class="works-projects-grid">
          <MProjectCard
            :key="featuredProject.id"
            :title="featuredProject.title"
            :url="featuredProject.url"
            :thumbnail="featuredProject.thumbnail || undefined"
            :is-live="true"
            :featured="true"
            :featured-site="isMarketingGenFeatured ? 'marketing-gen.pages.dev' : undefined"
          />
          <MProjectCard
            v-for="project in otherProjects"
            :key="project.id"
            :title="project.title"
            :url="project.url"
            :thumbnail="project.thumbnail || undefined"
            :is-live="true"
          />
        </div>
        <MProjectSpotlight />
      </div>

      <div v-if="upcoming.length" class="mb-16">
        <div class="works-subheading">
          <span class="works-upcoming-mark" aria-hidden="true" />
          <h3>
            {{ t('works.upcoming') }}
          </h3>
          <p>{{ t('works.upcoming_desc') }}</p>
        </div>
        <div class="works-projects-grid">
          <MProjectCard
            v-for="project in upcoming"
            :key="project.id"
            :title="project.title"
            :url="project.url"
            :thumbnail="project.thumbnail || undefined"
            :is-upcoming="true"
          />
        </div>
      </div>

      <details class="works-templates">
        <summary>
          <span class="works-templates-summary">
            <span class="works-templates-label">
              <strong>{{ t('works.templates') }}</strong>
              <small>{{ t('works.templates_desc') }} · {{ templates.length }}</small>
            </span>
            <span class="works-templates-toggle">{{ t('works.browse_templates') }} <span aria-hidden="true">↓</span></span>
          </span>
        </summary>
        <div class="works-template-grid">
          <MProjectCard
            v-for="template in templates"
            :key="template.id"
            :title="template.title"
            :url="template.url"
            :thumbnail="template.thumbnail || undefined"
          />
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
.works-section {
  background:
    radial-gradient(ellipse at 93% 5%, color-mix(in srgb, var(--md-sys-color-primary-container) 46%, transparent), transparent 34rem),
    var(--md-sys-color-surface-container-low);
}

.works-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3.5rem;
}

.works-heading > div {
  max-width: 46rem;
}

.section-eyebrow {
  margin-bottom: 0.8rem;
}

.section-heading {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.4rem, 5vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 1;
  text-wrap: balance;
}

.works-count {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex: 0 0 auto;
  padding: 0.8rem 1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8rem;
}

.works-count span {
  color: var(--md-sys-color-primary);
  font-size: 1.2rem;
  font-weight: 800;
}

.works-subheading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.works-subheading h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1.2rem;
  font-weight: 750;
  letter-spacing: -0.025em;
}

.works-subheading p {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.85rem;
}

.works-live-mark {
  width: 0.55rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #248b56;
  box-shadow: 0 0 0 4px color-mix(in srgb, #248b56 15%, transparent);
}

.works-upcoming-mark {
  width: 0.55rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #d99a2b;
  box-shadow: 0 0 0 4px color-mix(in srgb, #d99a2b 15%, transparent);
}

.works-projects-grid,
.works-template-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.works-projects-grid > :first-child {
  grid-column: 1 / -1;
}

.works-templates {
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.works-templates summary {
  /* `display: block` — NOT flex. `summary { display: flex }` breaks the native
     <details> toggle in iOS Safari (the "browse templates" disclosure wouldn't
     open on mobile). Flex layout moves to the inner `.works-templates-summary`. */
  display: block;
  padding: 1.4rem 0;
  cursor: pointer;
  list-style: none;
}

.works-templates-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.works-templates-label {
  display: grid;
  gap: 0.25rem;
}

.works-templates summary::-webkit-details-marker {
  display: none;
}

.works-templates summary strong {
  color: var(--md-sys-color-on-surface);
  font-size: 1.1rem;
}

.works-templates summary small {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
}

.works-templates-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--md-sys-color-primary);
  font-size: 0.84rem;
  font-weight: 700;
}

.works-templates-toggle span {
  transition: transform 180ms ease;
}

.works-templates[open] .works-templates-toggle span {
  transform: rotate(180deg);
}

.works-template-grid {
  padding-bottom: 1.5rem;
}

@media (min-width: 900px) {
  .works-projects-grid,
  .works-template-grid {
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .works-heading {
    align-items: start;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .works-projects-grid,
  .works-template-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .works-templates-summary {
    align-items: flex-start;
  }

  .works-templates-toggle {
    padding-top: 0.25rem;
    text-align: right;
  }
}
</style>
