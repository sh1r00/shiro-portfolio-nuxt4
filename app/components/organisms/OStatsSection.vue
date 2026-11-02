<script setup lang="ts">
const { t } = useI18n()
const { live, templates } = useWorks()

const stats = computed(() => [
  { key: 'projects', value: String(live.value.length + templates.value.length), icon: 'inventory_2' },
  { key: 'templates', value: String(templates.value.length), icon: 'palette' },
  { key: 'live', value: String(live.value.length), icon: 'rocket_launch' },
  { key: 'languages', value: '3', icon: 'language' },
])
</script>

<template>
  <section class="stats-section">
    <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <div class="stats-strip">
        <div v-for="stat in stats" :key="stat.key" class="stats-item">
          <div class="stats-value">{{ stat.value }}</div>
          <div class="stats-label">{{ t(`stats.${stat.key}`) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  position: relative;
  z-index: 2;
  padding: 0 1.25rem;
  background: var(--md-sys-color-surface);
}

.stats-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1.1rem;
  background: var(--md-sys-color-surface-container-low);
  box-shadow: 0 1.5rem 3rem -2.5rem color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  transform: translateY(-1.75rem);
}

.stats-item {
  padding: 1.1rem 1rem;
  text-align: center;
}

.stats-item + .stats-item {
  border-left: 1px solid var(--md-sys-color-outline-variant);
}

.stats-value {
  color: var(--md-sys-color-primary);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.06em;
}

.stats-label {
  margin-top: 0.1rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.72rem;
}

@media (max-width: 560px) {
  .stats-section {
    padding-inline: 0.75rem;
  }

  .stats-item {
    padding: 0.85rem 0.35rem;
  }

  .stats-label {
    font-size: 0.63rem;
  }
}
</style>
