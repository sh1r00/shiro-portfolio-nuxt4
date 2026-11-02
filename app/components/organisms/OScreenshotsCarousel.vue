<script setup lang="ts">
const { t } = useI18n()

const screenshots = [
  { src: '/img/restaurant-editable.png', alt: 'Savora Restaurant' },
  { src: '/img/realty-creditors.png', alt: 'Realty Creditors' },
  { src: '/img/your-blog.png', alt: 'DevBlog' },
  { src: '/img/shop-tulu.png', alt: 'Shop Tulu' },
  { src: '/img/credit-wizard.png', alt: 'Credit Wiz' },
  { src: '/img/trading-bot.png', alt: 'Money Conversion SPA' },
]

const current = ref(0)
const isPlaying = ref(false)
const isPointerOver = ref(false)
const isFocused = ref(false)
const isInteracting = computed(() => isPointerOver.value || isFocused.value)
const isPageVisible = ref(true)
const prefersReducedMotion = ref(false)
let interval: ReturnType<typeof setInterval> | null = null
let motionPreference: MediaQueryList | null = null

function next() {
  current.value = (current.value + 1) % screenshots.length
}

function prev() {
  current.value = (current.value - 1 + screenshots.length) % screenshots.length
}

function goTo(index: number) {
  current.value = index
}

function togglePlayback() {
  if (prefersReducedMotion.value) return
  isPlaying.value = !isPlaying.value
  isPointerOver.value = false
  isFocused.value = false
}

function syncInterval() {
  if (interval) clearInterval(interval)
  interval = null

  if (isPlaying.value && !isInteracting.value && isPageVisible.value && !prefersReducedMotion.value) {
    interval = setInterval(next, 5000)
  }
}

function handleFocusout(event: FocusEvent) {
  const carousel = event.currentTarget as HTMLElement
  const nextFocused = event.relatedTarget

  if (nextFocused instanceof Node && carousel.contains(nextFocused)) return
  isFocused.value = false
}

function handleVisibilityChange() {
  isPageVisible.value = document.visibilityState === 'visible'
}

function handleMotionPreferenceChange(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches
  if (event.matches) isPlaying.value = false
}

watch([isPlaying, isInteracting, isPageVisible], syncInterval)

onMounted(() => {
  isPageVisible.value = document.visibilityState === 'visible'
  document.addEventListener('visibilitychange', handleVisibilityChange)

  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionPreference.matches
  motionPreference.addEventListener('change', handleMotionPreferenceChange)

  syncInterval()
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  motionPreference?.removeEventListener('change', handleMotionPreferenceChange)
})
</script>

<template>
  <section id="screenshots" class="py-20 md:py-32">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">
          {{ t('works.screenshots') }}
        </p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">
          {{ t('works.screenshots_desc') }}
        </h2>
      </div>

      <div
        class="relative"
        role="region"
        aria-roledescription="carousel"
        :aria-label="t('works.carousel_label')"
        @mouseenter="isPointerOver = true"
        @mouseleave="isPointerOver = false"
        @focusin="isFocused = true"
        @focusout="handleFocusout"
      >
        <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-[var(--md-sys-color-surface-container)]">
          <Transition name="fade" mode="out-in">
            <img
              :key="current"
              :src="screenshots[current].src"
              :alt="screenshots[current].alt"
              class="w-full h-full object-cover"
            />
          </Transition>

          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p class="text-white font-semibold text-lg">{{ screenshots[current].alt }}</p>
          </div>
        </div>

        <button
          class="carousel-arrow carousel-arrow-previous"
          :aria-label="t('works.previous_screenshot')"
          @click="prev"
        >
          <span aria-hidden="true">◀</span>
        </button>
        <button
          class="carousel-arrow carousel-arrow-next"
          :aria-label="t('works.next_screenshot')"
          @click="next"
        >
          <span aria-hidden="true">▶</span>
        </button>

        <div class="carousel-controls">
          <button
            class="carousel-play"
            :aria-label="t(isPlaying ? 'works.pause_slideshow' : 'works.play_slideshow')"
            :aria-pressed="isPlaying"
            :disabled="prefersReducedMotion"
            @click="togglePlayback"
          >
            <span aria-hidden="true">{{ isPlaying ? 'Ⅱ' : '▶' }}</span>
          </button>
          <div class="carousel-dots">
            <button
              v-for="(_, index) in screenshots"
              :key="index"
              class="carousel-dot"
              :aria-label="t('works.go_to_screenshot', { number: index + 1 })"
              :aria-current="index === current ? 'true' : undefined"
              @click="goTo(index)"
            >
              <span
                class="carousel-dot-indicator"
                :class="index === current
                  ? 'carousel-dot-indicator-active'
                  : 'carousel-dot-indicator-inactive'"
              />
            </button>
          </div>
        </div>
        <p class="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {{ t('works.screenshot_status', { current: current + 1, total: screenshots.length }) }}:
          {{ screenshots[current].alt }}
        </p>
        <p v-if="prefersReducedMotion" class="carousel-motion-notice">
          {{ t('works.reduced_motion_notice') }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-arrow,
.carousel-play,
.carousel-dot {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  width: 2.75rem;
  height: 2.75rem;
  transform: translateY(-50%);
  background: rgb(0 0 0 / 48%);
  color: white;
  backdrop-filter: blur(8px);
  transition: background-color 160ms ease;
}

.carousel-arrow:hover {
  background: rgb(0 0 0 / 72%);
}

.carousel-arrow-previous {
  left: 0.75rem;
}

.carousel-arrow-next {
  right: 0.75rem;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.carousel-play {
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface);
  transition: background-color 160ms ease;
}

.carousel-play:hover {
  background: var(--md-sys-color-surface-container);
}

.carousel-play:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.carousel-motion-notice {
  margin-top: 0.5rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
  text-align: center;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.15rem;
}

.carousel-dot {
  width: 2.75rem;
  height: 2.75rem;
}

.carousel-dot-indicator {
  display: block;
  height: 0.65rem;
  border-radius: 999px;
  transition: width 180ms ease, background-color 180ms ease;
}

.carousel-dot-indicator-active {
  width: 2rem;
  background: var(--md-sys-color-primary);
}

.carousel-dot-indicator-inactive {
  width: 0.65rem;
  background: var(--md-sys-color-outline-variant);
}

.carousel-dot:hover .carousel-dot-indicator-inactive {
  background: var(--md-sys-color-outline);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 380px) {
  .carousel-controls {
    flex-direction: column;
    gap: 0.25rem;
  }

  .carousel-dots {
    gap: 0;
  }

  .carousel-dot {
    width: 2.75rem;
  }
}
</style>
