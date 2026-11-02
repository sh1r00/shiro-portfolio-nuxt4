<script setup lang="ts">
// Molecule: Project card for works section
defineProps<{
  title: string
  url: string
  thumbnail?: string
  isLive?: boolean
  featured?: boolean
  featuredSite?: string
}>()
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="project-card group block h-full"
    :class="{ 'project-card-featured': featured }"
  >
    <div class="project-card-inner">
      <div class="project-card-image">
        <AImage v-if="thumbnail" :src="thumbnail" :alt="title" />
        <div v-else-if="featuredSite" class="project-card-featured-art" aria-hidden="true">
          <span class="project-card-art-label">MARKETING-GEN</span>
          <span class="project-card-art-orbit project-card-art-orbit-one" />
          <span class="project-card-art-orbit project-card-art-orbit-two" />
          <span class="project-card-art-mark">M</span>
          <span class="project-card-art-domain">{{ featuredSite }}</span>
        </div>
        <div v-else class="aspect-video flex items-center justify-center">
          <span class="opacity-20"><AIcon name="image" size="lg" /></span>
        </div>
        <div v-if="isLive" class="project-card-live">
          <span class="project-card-live-dot" />
          {{ $t('works.live_badge') }}
        </div>
      </div>

      <div class="project-card-copy">
        <div>
          <p v-if="featured" class="project-card-kicker">{{ $t('works.featured_project') }}</p>
          <h3 class="project-card-title">{{ title }}</h3>
          <p v-if="featuredSite" class="project-card-domain">{{ featuredSite }}</p>
          <span class="project-card-link">
            {{ $t('works.view_site') }}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
        <span class="project-card-arrow" aria-hidden="true">↗</span>
      </div>
    </div>
  </a>
</template>

<style scoped>
.project-card-inner {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1.25rem;
  background: var(--md-sys-color-surface);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.project-card:hover .project-card-inner {
  transform: translateY(-5px);
  border-color: color-mix(in srgb, var(--md-sys-color-primary) 52%, var(--md-sys-color-outline-variant));
  box-shadow: 0 1.5rem 3rem -2rem color-mix(in srgb, var(--md-sys-color-on-surface) 35%, transparent);
}

.project-card:focus-visible {
  border-radius: 1.25rem;
  outline: 3px solid var(--md-sys-color-primary);
  outline-offset: 4px;
}

.project-card-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--md-sys-color-surface-container-high);
}

.project-card-featured-art {
  position: relative;
  display: grid;
  height: 100%;
  min-height: 12rem;
  overflow: hidden;
  place-items: center;
  background:
    radial-gradient(ellipse at 74% 35%, rgb(183 125 255 / 54%), transparent 29%),
    radial-gradient(ellipse at 20% 100%, rgb(84 55 193 / 75%), transparent 46%),
    linear-gradient(125deg, #17132d, #30205d 58%, #1a1637);
  color: #fff;
}

.project-card-art-label,
.project-card-art-domain {
  position: absolute;
  z-index: 1;
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.16em;
}

.project-card-art-label {
  top: 1.5rem;
  left: 1.75rem;
  color: rgb(255 255 255 / 72%);
}

.project-card-art-domain {
  right: 1.75rem;
  bottom: 1.5rem;
  color: rgb(255 255 255 / 68%);
  letter-spacing: 0.04em;
}

.project-card-art-orbit {
  position: absolute;
  width: min(52vw, 22rem);
  aspect-ratio: 1;
  border: 1px solid rgb(255 255 255 / 19%);
  border-radius: 50%;
}

.project-card-art-orbit-one {
  transform: scaleX(0.48) rotate(38deg);
}

.project-card-art-orbit-two {
  transform: scaleX(0.48) rotate(-38deg);
}

.project-card-art-mark {
  display: grid;
  width: clamp(5rem, 11vw, 8rem);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 38%);
  border-radius: 1.8rem;
  background: linear-gradient(145deg, rgb(255 255 255 / 21%), rgb(255 255 255 / 5%));
  box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 24%), inset 0 1px rgb(255 255 255 / 28%);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
}

.project-card-image :deep(img) {
  transition: transform 400ms ease;
}

.project-card:hover .project-card-image :deep(img) {
  transform: scale(1.035);
}

.project-card-live {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 999px;
  background: rgb(20 30 27 / 78%);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  backdrop-filter: blur(8px);
}

.project-card-live-dot {
  width: 0.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #79e4a4;
  box-shadow: 0 0 0 3px rgb(121 228 164 / 18%);
}

.project-card-copy {
  display: flex;
  min-height: 7rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
}

.project-card-kicker {
  margin-bottom: 0.3rem;
  color: var(--md-sys-color-primary);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.project-card-title {
  color: var(--md-sys-color-on-surface);
  font-size: 1.15rem;
  font-weight: 750;
  letter-spacing: -0.035em;
  transition: color 180ms ease;
}

.project-card-domain {
  margin-top: 0.45rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
}

.project-card:hover .project-card-title {
  color: var(--md-sys-color-primary);
}

.project-card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
}

.project-card-link span,
.project-card-arrow {
  color: var(--md-sys-color-primary);
}

.project-card-arrow {
  display: grid;
  width: 2.4rem;
  aspect-ratio: 1;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 50%;
  transition: color 180ms ease, background 180ms ease, transform 180ms ease;
}

.project-card:hover .project-card-arrow {
  transform: rotate(45deg);
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.project-card-featured .project-card-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(15rem, 0.65fr);
}

.project-card-featured .project-card-image {
  aspect-ratio: 16 / 8;
}

.project-card-featured .project-card-copy {
  min-height: auto;
  padding: clamp(1.25rem, 4vw, 3rem);
}

.project-card-featured .project-card-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.75rem, 3vw, 2.7rem);
  line-height: 1.1;
}

@media (max-width: 640px) {
  .project-card-featured .project-card-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .project-card-featured .project-card-image {
    aspect-ratio: 16 / 9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-inner,
  .project-card-image :deep(img),
  .project-card-arrow {
    transition: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-inner,
  .project-card-image :deep(img),
  .project-card-arrow {
    transition: none;
  }
}
</style>
