<script setup lang="ts">
// Molecule: Language switcher using three locale flags
const { locale, locales, setLocale } = useI18n()

const localeNames: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  am: 'አማ',
}

function switchLocale(code: string) {
  setLocale(code)
}
</script>

<template>
  <div class="flex items-center gap-1" role="group" aria-label="Language selector">
    <button
      v-for="l in locales"
      :key="l.code"
      :aria-pressed="locale === l.code"
      :class="[
        'px-2.5 py-1 text-xs font-semibold rounded-full transition-all',
        locale === l.code
          ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
          : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]',
      ]"
      @click="switchLocale(l.code)"
    >
      {{ localeNames[l.code] || l.code.toUpperCase() }}
    </button>
  </div>
</template>
