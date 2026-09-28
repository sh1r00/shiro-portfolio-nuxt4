<script setup lang="ts">
const darkMode = useDarkModeStore()

// Apply persisted dark mode on mount (toggle() already applies the class on change)
onMounted(() => {
  darkMode.initialize()
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
