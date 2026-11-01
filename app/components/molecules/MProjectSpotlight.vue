<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <ACard variant="outlined" padding="lg" class="mt-8 border-[var(--md-sys-color-primary)]/40">
    <div class="flex flex-col sm:flex-row gap-5">
      <div class="w-14 h-14 rounded-2xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center shrink-0">
        <AIcon name="casino" size="lg" />
      </div>

      <div class="min-w-0">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)]">
          {{ t('works.spotlight_label') }}
        </p>
        <h3 class="text-2xl font-bold text-[var(--md-sys-color-on-surface)] mt-1">
          {{ t('works.spotlight_title') }}
        </h3>
        <p class="text-[var(--md-sys-color-on-surface-variant)] mt-2">
          {{ t('works.spotlight_summary') }}
        </p>

        <div class="grid gap-3 mt-5 text-sm text-[var(--md-sys-color-on-surface-variant)]">
          <p>{{ t('works.spotlight_architecture') }}</p>
          <p>{{ t('works.spotlight_lesson') }}</p>
          <p class="text-xs">{{ t('works.spotlight_checks') }}</p>
        </div>
      </div>
    </div>
  </ACard>
</template>
