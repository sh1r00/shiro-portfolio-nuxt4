<script setup lang="ts">
const darkMode = useDarkModeStore()

// Apply dark mode on mount and on change
onMounted(() => {
  darkMode.applyToDocument()
})

watch(() => darkMode.isDark, () => {
  darkMode.applyToDocument()
})
</script>

<template>
  <div>
    <!-- Skip to content — accessibility -->
    <a href="#main-content" class="skip-to-content">
      Skip to content
    </a>

    <ONavbar />

    <main id="main-content">
      <slot />
    </main>

    <OFooter />
  </div>
</template>
