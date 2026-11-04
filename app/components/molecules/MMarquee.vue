<script setup lang="ts">
const items = [
  'Nuxt 4',
  'Vue 3',
  'M3 Design',
  'i18n en/es/am',
  'PWA',
  'Hapi.js',
  'MongoDB',
  'Supabase',
  'Stripe',
  'Cloudflare',
  'OpenAI',
  'Accessibility',
]
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <div v-for="n in 2" :key="n" class="marquee-group">
        <span v-for="item in items" :key="`${n}-${item}`" class="marquee-item">
          {{ item }} <span class="marquee-star">✦</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  padding: 1.1rem 0;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-low) 70%, transparent);
  user-select: none;
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 32s linear infinite;
}
.marquee:hover .marquee-track {
  animation-play-state: paused;
}
.marquee-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.1rem;
  color: var(--md-sys-color-on-surface-variant);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.marquee-star {
  color: var(--md-sys-color-primary);
  font-family: sans-serif;
  font-size: 0.9rem;
}
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
</style>
