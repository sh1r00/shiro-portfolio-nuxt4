<script setup lang="ts">
defineProps<{
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  filled?: boolean
}>()

const sizeMap: Record<string, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
}
</script>

<template>
  <span
    :class="[
      'material-symbols-outlined select-none',
      sizeMap[size || 'md'],
      filled ? 'material-symbols-outlined-fill' : '',
    ]"
    aria-hidden="true"
  >
    {{ name }}
  </span>
</template>
