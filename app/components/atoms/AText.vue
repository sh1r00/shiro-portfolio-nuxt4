<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'headline' | 'title' | 'subtitle' | 'body' | 'caption' | 'label'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  gradient?: boolean
}>(), {
  variant: 'body',
  as: 'p',
  gradient: false,
})

const variantMap: Record<string, { tag: string; classes: string }> = {
  headline: { tag: 'h1', classes: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight' },
  title: { tag: 'h2', classes: 'text-2xl md:text-3xl lg:text-4xl font-bold' },
  subtitle: { tag: 'h3', classes: 'text-xl md:text-2xl font-semibold' },
  body: { tag: 'p', classes: 'text-base leading-relaxed' },
  caption: { tag: 'span', classes: 'text-sm opacity-80' },
  label: { tag: 'span', classes: 'text-sm font-medium uppercase tracking-wider' },
}
</script>

<template>
  <component
    :is="as"
    :class="[
      variantMap[variant].classes,
      gradient ? 'bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent' : '',
    ]"
  >
    <slot />
  </component>
</template>
