<script setup lang="ts">
import type { Toast } from '~/stores/toast'

const props = defineProps<{ toast: Toast }>()
const emit = defineEmits<{ dismiss: [] }>()

const typeStyles: Record<string, string> = {
  success: 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]',
  error: 'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]',
  warning: 'bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]',
  info: 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]',
}
</script>

<template>
  <div
    :class="['flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg', typeStyles[props.toast.type]]"
    role="status"
  >
    <span class="text-sm font-medium">{{ props.toast.message }}</span>
    <button type="button" class="ml-auto opacity-60 hover:opacity-100" aria-label="Dismiss" @click="emit('dismiss')">
      <AIcon name="close" size="sm" />
    </button>
  </div>
</template>
