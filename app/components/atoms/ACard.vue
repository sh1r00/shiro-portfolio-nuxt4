<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'elevated' | 'filled' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}>(), {
  variant: 'elevated',
  padding: 'md',
  hover: false,
})

const variantClasses: Record<string, string> = {
  elevated: 'bg-[var(--md-sys-color-surface-container-low)] shadow-md',
  filled: 'bg-[var(--md-sys-color-surface-container)]',
  outlined: 'border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)]',
}

const paddingMap: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    :class="[
      'rounded-3xl transition-all duration-300',
      variantClasses[variant],
      paddingMap[padding],
      hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '',
    ]"
  >
    <slot />
  </div>
</template>
