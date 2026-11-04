<script setup lang="ts">
const { t } = useI18n()
const taglineWords = computed(() => t('hero.tagline').split(' '))

const featuredVisuals = [
  { src: '/img/shop-tulu.png', alt: 'Shop Tulu', class: 'hero-visual-primary' },
  { src: '/img/credit-wizard.png', alt: 'Credit Wiz', class: 'hero-visual-secondary' },
  { src: '/img/realty-creditors.png', alt: 'Realty Creditors', class: 'hero-visual-tertiary' },
]
</script>

<template>
  <section v-spotlight id="home" class="hero-section relative isolate overflow-hidden">
    <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
    <div class="hero-glow hero-glow-primary absolute -z-10" aria-hidden="true" />
    <div class="hero-glow hero-glow-secondary absolute -z-10" aria-hidden="true" />
    <div class="hero-spotlight" aria-hidden="true" />

    <div class="hero-layout max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <div class="hero-copy min-w-0">
        <p class="hero-eyebrow">
          <span class="hero-eyebrow-dot" aria-hidden="true" />
          {{ t('hero.greeting') }} 👋
        </p>
        <h1 class="hero-title">
          <span v-for="(word, i) in taglineWords" :key="i" class="hero-word">{{ word }}</span>
        </h1>
        <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
        <div class="hero-actions">
          <AButton v-magnetic href="#works" variant="filled" size="lg">{{ t('hero.cta_works') }} <span aria-hidden="true">↗</span></AButton>
          <AButton v-magnetic href="#contact" variant="outlined" size="lg">{{ t('hero.cta_contact') }}</AButton>
        </div>
        <div class="hero-proof" aria-hidden="true">
          <span>Nuxt 4</span>
          <span>Vue 3</span>
          <span>Cloudflare</span>
        </div>
      </div>

      <div class="hero-art" aria-label="Selected project previews">
        <div v-tilt="5" class="hero-art-frame">
          <div class="hero-art-topline">
            <span class="hero-art-label">SELECTED WORK</span>
            <span class="hero-art-mark" aria-hidden="true">✳</span>
          </div>
          <div class="hero-art-collage">
            <figure
              v-for="visual in featuredVisuals"
              :key="visual.src"
              :class="['hero-visual', visual.class]"
            >
              <img :src="visual.src" :alt="visual.alt" :fetchpriority="visual.class === 'hero-visual-primary' ? 'high' : 'auto'" />
              <figcaption>{{ visual.alt }}</figcaption>
            </figure>
          </div>
          <div class="hero-art-footer">
            <span>Design-minded engineering</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
        <span class="hero-orbit hero-orbit-one" aria-hidden="true" />
        <span class="hero-orbit hero-orbit-two" aria-hidden="true" />
      </div>
    </div>

    <a href="#works" class="hero-scroll-cue" :aria-label="t('hero.scroll')">
      <span>{{ t('hero.scroll') }}</span>
      <span class="hero-scroll-cue-chevron" aria-hidden="true">↓</span>
    </a>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: min(860px, 100svh);
  display: flex;
  align-items: center;
  padding-top: 7.5rem;
  padding-bottom: 5rem;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--md-sys-color-surface) 94%, var(--md-sys-color-primary-container)), var(--md-sys-color-surface) 62%);
}

.hero-grid {
  opacity: 0.32;
  background-image: linear-gradient(to right, var(--md-sys-color-outline-variant) 1px, transparent 1px), linear-gradient(to bottom, var(--md-sys-color-outline-variant) 1px, transparent 1px);
  background-size: 4rem 4rem;
  mask-image: linear-gradient(to right, black, transparent 78%);
}

.hero-glow {
  width: min(40vw, 34rem);
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.22;
}

.hero-glow-primary {
  top: 8%;
  left: -12%;
  background: var(--md-sys-color-primary-container);
  animation: aurora-drift 16s ease-in-out infinite;
}

.hero-glow-secondary {
  right: -14%;
  bottom: -16%;
  background: var(--md-sys-color-tertiary-container);
  animation: aurora-drift 22s ease-in-out -7s infinite;
}

@keyframes aurora-drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(5%, 4%) scale(1.12);
  }
  66% {
    transform: translate(-4%, -3%) scale(0.94);
  }
}

.hero-layout {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.94fr);
  align-items: center;
  gap: clamp(2.5rem, 6vw, 6rem);
}

.hero-copy {
  max-width: 39rem;
  animation: rise-in 700ms ease-out both;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.hero-eyebrow-dot {
  width: 0.55rem;
  height: 0.55rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--md-sys-color-tertiary);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--md-sys-color-tertiary) 15%, transparent);
}

.hero-title {
  max-width: 11ch;
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3.5rem, 7.3vw, 6.9rem);
  font-weight: 700;
  letter-spacing: -0.075em;
  line-height: 0.94;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.hero-title span {
  background: linear-gradient(120deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  max-width: 32rem;
  margin: 1.75rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  margin-top: 2rem;
}

.hero-actions :deep(a) {
  min-height: 3.25rem;
}

.hero-proof {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 2.25rem;
}

.hero-proof span {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  background: color-mix(in srgb, var(--md-sys-color-surface) 65%, transparent);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 600;
}

.hero-art {
  position: relative;
  min-width: 0;
  padding: 1rem;
  animation: rise-in 850ms 100ms ease-out both;
}

.hero-art-frame {
  position: relative;
  z-index: 1;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 75%, transparent);
  border-radius: 1.75rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-low) 88%, transparent);
  box-shadow: 0 2rem 5rem -2.5rem color-mix(in srgb, var(--md-sys-color-on-surface) 35%, transparent);
  backdrop-filter: blur(14px);
}

.hero-art-topline,
.hero-art-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.hero-art-label {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.hero-art-mark {
  color: var(--md-sys-color-tertiary);
  font-size: 1.5rem;
}

.hero-art-collage {
  position: relative;
  min-height: clamp(17rem, 35vw, 27rem);
  margin: 1rem 0;
}

.hero-visual {
  position: absolute;
  overflow: hidden;
  margin: 0;
  padding: 0.45rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 0.95rem;
  background: var(--md-sys-color-surface);
  box-shadow: 0 1.2rem 2.5rem -1.5rem rgb(18 15 30 / 48%);
}

.hero-visual img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 0.6rem;
  object-fit: cover;
  object-position: top;
}

.hero-visual figcaption {
  padding: 0.55rem 0.35rem 0.2rem;
  color: var(--md-sys-color-on-surface);
  font-size: 0.73rem;
  font-weight: 700;
}

.hero-visual-primary {
  z-index: 2;
  top: 4%;
  left: 7%;
  width: 77%;
  height: 72%;
  transform: rotate(-3deg);
}

.hero-visual-secondary {
  z-index: 3;
  right: 0;
  bottom: 1%;
  width: 53%;
  height: 57%;
  transform: rotate(4deg);
}

.hero-visual-tertiary {
  z-index: 1;
  right: 4%;
  top: 2%;
  width: 37%;
  height: 43%;
  transform: rotate(7deg);
}

.hero-art-footer {
  padding-top: 0.85rem;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8rem;
}

.hero-art-footer span:last-child {
  color: var(--md-sys-color-primary);
  font-size: 1.1rem;
}

.hero-orbit {
  position: absolute;
  z-index: 0;
  width: 5rem;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--md-sys-color-primary) 38%, transparent);
  border-radius: 50%;
}

.hero-orbit-one {
  top: -1rem;
  right: -0.5rem;
}

.hero-orbit-two {
  bottom: -0.5rem;
  left: -0.5rem;
  width: 2.75rem;
  background: var(--md-sys-color-tertiary-container);
  opacity: 0.7;
}

@keyframes rise-in {
  from { opacity: 0; transform: translateY(1.25rem); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 767px) {
  .hero-section {
    min-height: 0;
    padding-top: 7rem;
    padding-bottom: 3.5rem;
  }

  .hero-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  .hero-title {
    max-width: 12ch;
    font-size: clamp(3rem, 15vw, 5rem);
    letter-spacing: -0.07em;
  }

  .hero-subtitle {
    margin-top: 1.25rem;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .hero-actions :deep(a) {
    width: 100%;
    padding-inline: 0.75rem;
    font-size: 0.95rem;
  }

  .hero-art {
    width: min(100%, 34rem);
    margin: 0 auto;
    padding: 0.7rem;
  }

  .hero-art-collage {
    min-height: clamp(15rem, 70vw, 22rem);
  }
}

@media (max-width: 360px) {
  .hero-actions {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy,
  .hero-art {
    animation: none;
  }
}

/* --- Interactive hero effects --- */
.hero-spotlight {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    560px circle at var(--spot-x, 50%) var(--spot-y, 40%),
    color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent),
    transparent 62%
  );
}

.hero-word {
  display: inline-block;
  margin-right: 0.28em;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms ease;
}

.hero-word:last-child {
  margin-right: 0;
}

.hero-word:hover {
  transform: translateY(-5px);
  filter: brightness(1.18) saturate(1.15);
}

.hero-subtitle {
  position: relative;
}

.hero-subtitle::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.7rem;
  width: 100%;
  max-width: 15rem;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  transform-origin: left;
  animation: draw-in 1.1s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes draw-in {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.hero-scroll-cue {
  position: absolute;
  bottom: 1.4rem;
  left: 50%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  transform: translateX(-50%);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
}

.hero-scroll-cue-chevron {
  color: var(--md-sys-color-primary);
  font-size: 1.1rem;
  animation: scroll-bounce 1.7s ease-in-out infinite;
}

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(6px); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-scroll-cue-chevron {
    animation: none;
  }
}
</style>
