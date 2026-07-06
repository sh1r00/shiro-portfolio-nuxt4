<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  variant?: 'small' | 'standard'
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
}>(), {
  variant: 'standard',
  color: 'primary',
})

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]',
  secondary: 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]',
  tertiary: 'bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]',
  error: 'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-medium',
      colorMap[color],
      variant === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
    ]"
  >
    <slot />
  </span>
</template>
