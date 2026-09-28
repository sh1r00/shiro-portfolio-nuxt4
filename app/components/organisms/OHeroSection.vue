<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--md-sys-color-primary-container)]/30 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--md-sys-color-tertiary-container)]/20 rounded-full blur-3xl" />
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
      <p class="text-lg md:text-xl text-[var(--md-sys-color-on-surface-variant)] mb-4 animate-fade-in">
        {{ t('hero.greeting') }} 👋
      </p>
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
        <span class="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent">
          {{ t('hero.tagline') }}
        </span>
      </h1>
      <p class="text-lg md:text-xl text-[var(--md-sys-color-on-surface-variant)] max-w-2xl mx-auto mb-10">
        {{ t('hero.subtitle') }}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <AButton href="#works" variant="filled" size="lg">{{ t('hero.cta_works') }} ↓</AButton>
        <AButton href="#contact" variant="outlined" size="lg">{{ t('hero.cta_contact') }}</AButton>
      </div>
      <div class="mt-16 animate-bounce">
        <span class="text-2xl text-[var(--md-sys-color-on-surface-variant)] opacity-50">↓</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
