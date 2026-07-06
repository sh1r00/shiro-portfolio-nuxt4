<script setup lang="ts">
// Molecule: Project card for works section
defineProps<{
  title: string
  url: string
  thumbnail?: string
  isLive?: boolean
}>()
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="group block"
  >
    <div class="relative rounded-2xl overflow-hidden bg-[var(--md-sys-color-surface-container)] transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
      <!-- Thumbnail -->
      <div class="aspect-video overflow-hidden bg-[var(--md-sys-color-surface-container-high)]">
        <img
          v-if="thumbnail"
          :src="thumbnail"
          :alt="title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <span class="text-4xl opacity-20">🖼️</span>
        </div>
      </div>

      <!-- Badge -->
      <div v-if="isLive" class="absolute top-3 right-3">
        <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] shadow-md">
          ● {{ $t('works.live_badge') }}
        </span>
      </div>

      <!-- Title -->
      <div class="p-4">
        <h3 class="font-semibold text-[var(--md-sys-color-on-surface)] group-hover:text-[var(--md-sys-color-primary)] transition-colors">
          {{ title }}
        </h3>
        <span class="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1 inline-block">
          {{ $t('works.view_site') }} →
        </span>
      </div>
    </div>
  </a>
</template>
