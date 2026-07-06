<script setup lang="ts">
defineProps<{
  href: string
  external?: boolean
  underline?: boolean
}>()
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="[
      'inline-flex items-center gap-1 text-[var(--md-sys-color-primary)] hover:opacity-80 transition-opacity font-medium',
      underline ? 'underline' : '',
    ]"
  >
    <slot />
  </a>
</template>
