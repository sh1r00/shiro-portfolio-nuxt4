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
  <header class="site-header fixed top-0 left-0 right-0 z-50 bg-[var(--md-sys-color-surface)]/85 backdrop-blur-xl border-b border-[var(--md-sys-color-outline-variant)]">
    <nav class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8" :aria-label="t('nav.main_label')">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="#home" class="site-brand flex shrink-0 items-center gap-2 font-bold text-xl text-[var(--md-sys-color-on-surface)] hover:text-[var(--md-sys-color-primary)] transition-colors">
          <AIcon name="auto_awesome" size="md" />
          <span class="bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent">shiro</span>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="item in navItems"
            :key="item.key"
            :href="item.href"
            class="nav-link px-4 py-2 text-sm font-medium rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-all"
            :class="{ 'nav-link-contact': item.key === 'contact' }"
          >
            {{ t(`nav.${item.key}`) }}
          </a>
        </div>

        <!-- Right side -->
        <div class="flex shrink-0 items-center gap-1 sm:gap-3">
          <MLanguageSwitcher />

          <!-- Dark mode toggle -->
          <button
            class="header-icon-button rounded-full hover:bg-[var(--md-sys-color-surface-container)] transition-colors"
            :aria-label="darkMode.isDark ? t('theme.light') : t('theme.dark')"
            @click="toggleDark"
          >
            <AIcon :name="darkMode.isDark ? 'light_mode' : 'dark_mode'" size="sm" />
          </button>

          <!-- Mobile hamburger -->
          <button
            class="header-icon-button md:hidden rounded-full hover:bg-[var(--md-sys-color-surface-container)]"
            :aria-label="t(mobileOpen ? 'nav.close_menu' : 'nav.open_menu')"
            :aria-expanded="mobileOpen"
            aria-controls="mobile-menu"
            @click="mobileOpen = !mobileOpen"
          >
            <AIcon :name="mobileOpen ? 'close' : 'menu'" size="sm" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" id="mobile-menu" class="md:hidden py-4 border-t border-[var(--md-sys-color-outline-variant)]">
        <a
          v-for="item in navItems"
          :key="item.key"
          :href="item.href"
          class="nav-link block px-4 py-3 text-sm font-medium rounded-xl text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)] transition-all"
          :class="{ 'nav-link-contact': item.key === 'contact' }"
          @click="closeMobile"
        >
          {{ t(`nav.${item.key}`) }}
        </a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  box-shadow: 0 0.6rem 2rem -1.6rem color-mix(in srgb, var(--md-sys-color-on-surface) 40%, transparent);
}

.nav-link-contact {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.nav-link-contact:hover {
  background: color-mix(in srgb, var(--md-sys-color-primary) 88%, black);
  color: var(--md-sys-color-on-primary);
}

.header-icon-button {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
  place-items: center;
}

@media (max-width: 767px) {
  .nav-link-contact {
    margin-top: 0.35rem;
  }
}

@media (max-width: 359px) {
  .site-brand {
    gap: 0.35rem;
    font-size: 1.1rem;
  }
}
</style>
