<script setup lang="ts">
const { t } = useI18n()

const screenshots = [
  { src: '/img/restaurant-editable.png', alt: 'Savora Restaurant' },
  { src: '/img/realty-creditors.png',    alt: 'Realty Creditors' },
  { src: '/img/your-blog.png',           alt: 'DevBlog' },
  { src: '/img/shop-tulu.png',           alt: 'Shop Tulu' },
  { src: '/img/credit-wizard.png',       alt: 'Credit Wiz' },
  { src: '/img/trading-bot.png',         alt: 'Money Conversion SPA' },
]

const current = ref(0)

function next() {
  current.value = (current.value + 1) % screenshots.length
}
function prev() {
  current.value = (current.value - 1 + screenshots.length) % screenshots.length
}
function goTo(index: number) {
  current.value = index
}

// Auto-advance
let interval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  interval = setInterval(next, 4000)
})
onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <section id="screenshots" class="py-20 md:py-32">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">
          {{ t('works.screenshots') }}
        </p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">
          {{ t('works.screenshots_desc') }}
        </h2>
      </div>

      <!-- Carousel -->
      <div class="relative">
        <!-- Main image -->
        <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-[var(--md-sys-color-surface-container)]">
          <Transition name="fade" mode="out-in">
            <img
              :key="current"
              :src="screenshots[current].src"
              :alt="screenshots[current].alt"
              class="w-full h-full object-cover"
            />
          </Transition>

          <!-- Caption -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p class="text-white font-semibold text-lg">{{ screenshots[current].alt }}</p>
          </div>
        </div>

        <!-- Prev/Next buttons -->
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-all"
          aria-label="Previous screenshot"
          @click="prev"
        >◀</button>
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-all"
          aria-label="Next screenshot"
          @click="next"
        >▶</button>

        <!-- Dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, index) in screenshots"
            :key="index"
            class="w-2.5 h-2.5 rounded-full transition-all"
            :class="index === current
              ? 'bg-[var(--md-sys-color-primary)] w-8'
              : 'bg-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-outline)]'"
            :aria-label="`Go to screenshot ${index + 1}`"
            @click="goTo(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
