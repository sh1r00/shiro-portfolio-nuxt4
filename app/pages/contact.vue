<script setup lang="ts">
const { t, locale } = useI18n()
const { content } = useContent()
const toast = useToastStore()

const email = computed(() => content.value.contact_email || 'joedoe98210@gmail.com')
const phone = computed(() => content.value.contact_phone || '')
const location = computed(() => content.value.contact_location || '')

const formData = ref({ name: '', email: '', message: '' })
const submitted = ref(false)
const sending = ref(false)
const error = ref('')

useHead(() => ({
  title: t('contact.title'),
  htmlAttrs: { lang: locale.value },
}))

async function handleSubmit() {
  const { name, email: fromEmail, message } = formData.value
  if (!name || !fromEmail || !message) return
  sending.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: { name, email: fromEmail, message } })
    submitted.value = true
    formData.value = { name: '', email: '', message: '' }
    setTimeout(() => { submitted.value = false }, 4000)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || t('contact.error')
    toast.error(error.value)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="py-20 md:py-32">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">{{ t('contact.title') }}</p>
        <h1 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">{{ t('contact.subtitle') }}</h1>
      </div>

      <!-- Direct contact info (drawn from the DB) -->
      <div class="mb-10 grid gap-4 sm:grid-cols-3">
        <ACard variant="filled" padding="md" class="text-center">
          <AIcon name="mail" size="lg" class="text-[var(--md-sys-color-primary)]" />
          <div class="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">{{ t('contact.email') }}</div>
          <a :href="`mailto:${email}`" class="mt-1 block font-semibold text-[var(--md-sys-color-primary)] hover:underline break-all">{{ email }}</a>
        </ACard>
        <ACard v-if="phone" variant="filled" padding="md" class="text-center">
          <AIcon name="call" size="lg" class="text-[var(--md-sys-color-primary)]" />
          <div class="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">{{ t('contact.phone') }}</div>
          <a :href="`tel:${phone}`" class="mt-1 block font-semibold text-[var(--md-sys-color-primary)] hover:underline">{{ phone }}</a>
        </ACard>
        <ACard v-if="location" variant="filled" padding="md" class="text-center">
          <AIcon name="location_on" size="lg" class="text-[var(--md-sys-color-primary)]" />
          <div class="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">{{ t('contact.location') }}</div>
          <div class="mt-1 font-semibold text-[var(--md-sys-color-on-surface)]">{{ location }}</div>
        </ACard>
      </div>

      <!-- Mailto CTA -->
      <div class="mb-10 text-center">
        <a :href="`mailto:${email}`" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-semibold hover:opacity-90 transition-opacity">
          <AIcon name="send" size="sm" />
          {{ t('contact.mailto_cta') }}
        </a>
      </div>

      <!-- Form -->
      <div v-if="submitted" class="mb-8 p-6 rounded-3xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] text-center">
        <AIcon name="check_circle" size="lg" />
        <p class="font-semibold mt-2">{{ t('contact.success') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="c-name" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">{{ t('contact.name') }}</label>
          <input id="c-name" v-model="formData.name" type="text" required class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all" :placeholder="t('contact.name')" />
        </div>
        <div>
          <label for="c-email" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">{{ t('contact.email') }}</label>
          <input id="c-email" v-model="formData.email" type="email" required class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all" :placeholder="t('contact.email')" />
        </div>
        <div>
          <label for="c-message" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">{{ t('contact.message') }}</label>
          <textarea id="c-message" v-model="formData.message" rows="5" required class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all resize-none" :placeholder="t('contact.message')" />
        </div>
        <p v-if="error" role="alert" class="text-sm text-[var(--md-sys-color-error)]">{{ error }}</p>
        <AButton type="submit" size="lg" class="w-full" :disabled="sending">{{ sending ? '…' : t('contact.send') }}</AButton>
      </form>
    </div>
  </div>
</template>
