<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()

const localeNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  am: 'አማርኛ',
}

const localeShortNames: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  am: 'አማ',
}

function switchLocale(code: string) {
  setLocale(code)
}
</script>

<template>
  <div class="language-switcher flex items-center gap-0.5 sm:gap-1" role="group" :aria-label="t('nav.language_selector')">
    <button
      v-for="l in locales"
      :key="l.code"
      :aria-pressed="locale === l.code"
      :aria-label="t('nav.language_option', { language: localeNames[l.code] || l.code })"
      :class="[
        'language-switcher-option px-2.5 py-1 text-xs font-semibold rounded-full transition-all',
        locale === l.code
          ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
          : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container)]',
      ]"
      @click="switchLocale(l.code)"
    >
      {{ localeShortNames[l.code] || l.code.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher-option {
  min-height: 2.75rem;
}

@media (max-width: 359px) {
  .language-switcher-option {
    padding-inline: 0.4rem;
    font-size: 0.65rem;
  }
}
</style>
