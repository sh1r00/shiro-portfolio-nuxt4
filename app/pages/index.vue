<script setup lang="ts">
const { locale } = useI18n()
const head = useLocaleHead({ seo: true })

useHead(() => ({
  title: 'shiro — where style meets function',
  meta: [
    { name: 'description', content: 'Full-stack web development portfolio — Nuxt 4, Vue 3, M3 Design, 16+ projects deployed' },
    ...(head.value.meta || []),
  ],
  link: [...(head.value.link || [])],
  htmlAttrs: { ...(head.value.htmlAttrs || {}), lang: locale.value },
}))
</script>

<template>
  <OHeroSection />
  <OStatsSection />
  <OSkillsSection />
  <OWorksSection />
  <OScreenshotsCarousel />
  <OAboutSection />
  <OContactSection />
</template>
