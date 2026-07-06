<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  alt?: string
  aspectRatio?: string
  rounded?: boolean
  cover?: boolean
}>(), {
  alt: '',
  aspectRatio: '16/9',
  rounded: true,
  cover: true,
})
</script>

<template>
  <div
    :class="['overflow-hidden', rounded ? 'rounded-2xl' : '']"
    :style="{ aspectRatio }"
  >
    <img
      :src="src"
      :alt="alt"
      :class="['w-full h-full', cover ? 'object-cover' : 'object-contain']"
      loading="lazy"
    />
  </div>
</template>
