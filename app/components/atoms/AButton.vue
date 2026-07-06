<script setup lang="ts">
defineProps<{
  variant?: 'filled' | 'outlined' | 'text'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-full',
  md: 'px-6 py-2.5 text-base rounded-full',
  lg: 'px-8 py-3.5 text-lg rounded-full',
}

const variantClasses = {
  filled: 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:opacity-90 shadow-md hover:shadow-lg transition-all',
  outlined: 'border-2 border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] hover:border-[var(--md-sys-color-primary)] transition-all',
  text: 'text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)] transition-all',
}

const component = computed(() => {
  if (props.href) return 'a'
  if (props.to) return resolveComponent('NuxtLink')
  return 'button'
})
</script>

<template>
  <component
    :is="component"
    :href="href"
    :to="to"
    :type="type || 'button'"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold cursor-pointer',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]',
      sizeClasses[size || 'md'],
      variantClasses[variant || 'filled'],
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>
