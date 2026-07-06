<script setup lang="ts">
const { t } = useI18n()
const darkMode = useDarkModeStore()

const navItems = [
  { key: 'home', href: '#home' },
  { key: 'skills', href: '#skills' },
  { key: 'works', href: '#works' },
  { key: 'screenshots', href: '#screenshots' },
  { key: 'contact', href: '#contact' },
]

const mobileOpen = ref(false)

function toggleDark() {
  darkMode.toggle()
}

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[var(--md-sys-color-surface)]/80 backdrop-blur-lg border-b border-[var(--md-sys-color-outline-variant)]">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="#home" class="flex items-center gap-2 font-bold text-xl text-[var(--md-sys-color-on-surface)] hover:text-[var(--md-sys-color-primary)] transition-colors">
          <span class="text-2xl">✨</span>
          <span class="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent">shiro</span>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="item in navItems"
            :key="item.key"
            :href="item.href"
            class="px-4 py-2 text-sm font-medium rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-all"
          >
            {{ t(`nav.${item.key}`) }}
          </a>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <MLanguageSwitcher />

          <!-- Dark mode toggle -->
          <button
            class="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-container)] transition-colors"
            :aria-label="darkMode.isDark ? t('theme.light') : t('theme.dark')"
            @click="toggleDark"
          >
            <span class="text-xl">{{ darkMode.isDark ? '☀️' : '🌙' }}</span>
          </button>

          <!-- Mobile hamburger -->
          <button
            class="md:hidden p-2 rounded-full hover:bg-[var(--md-sys-color-surface-container)]"
            aria-label="Toggle menu"
            @click="mobileOpen = !mobileOpen"
          >
            <span class="text-xl">☰</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="md:hidden py-4 border-t border-[var(--md-sys-color-outline-variant)]">
        <a
          v-for="item in navItems"
          :key="item.key"
          :href="item.href"
          class="block px-4 py-3 text-sm font-medium rounded-xl text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-all"
          @click="closeMobile"
        >
          {{ t(`nav.${item.key}`) }}
        </a>
      </div>
    </nav>
  </header>
</template>
