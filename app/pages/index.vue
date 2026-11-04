<script setup lang="ts">
const { locale } = useI18n()
const head = useLocaleHead({ seo: true })

useHead(() => ({
  title: 'shiro — where style meets function',
  meta: [
    { name: 'description', content: 'Full-stack web development portfolio — Nuxt 4, Vue 3, M3 Design, production apps and ready-to-use templates' },
    ...(head.value.meta || []),
  ],
  link: [...(head.value.link || [])],
  htmlAttrs: { ...(head.value.htmlAttrs || {}), lang: locale.value },
}))
</script>

<template>
  <OHeroSection />
  <MMarquee />
  <OStatsSection v-reveal />
  <OWorksSection v-reveal />
  <OCaseStudiesSection v-reveal />
  <OScreenshotsCarousel v-reveal />
  <OSkillsSection v-reveal />
  <OAboutSection v-reveal />
  <OContactSection v-reveal />
</template>
