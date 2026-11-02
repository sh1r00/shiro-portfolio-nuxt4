<script setup lang="ts">
const { t } = useI18n()
const toast = useToastStore()

const formData = ref({ name: '', email: '', message: '' })
const submitted = ref(false)
const sending = ref(false)
const error = ref('')

async function handleSubmit() {
  const { name, email, message } = formData.value
  if (!name || !email || !message) return
  submitted.value = false
  sending.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: { name, email, message } })
    submitted.value = true
    formData.value = { name: '', email: '', message: '' }
  } catch (e: any) {
    error.value = e?.data?.statusMessage || t('contact.error')
    toast.error(error.value)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section id="contact" class="contact-section py-20 md:py-28 bg-[var(--md-sys-color-surface-container-low)]">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="contact-heading">
        <p class="section-eyebrow">{{ t('contact.title') }}</p>
        <h2>{{ t('contact.subtitle') }}</h2>
      </div>

      <div v-if="submitted" role="status" aria-live="polite" aria-atomic="true" class="mb-8 p-6 rounded-3xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] text-center">
        <AIcon name="check_circle" size="lg" />
        <p class="font-semibold mt-2">{{ t('contact.success') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">{{ t('contact.name') }}</label>
          <input id="name" v-model="formData.name" type="text" autocomplete="name" maxlength="100" required class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all" :placeholder="t('contact.name')" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">{{ t('contact.email') }}</label>
          <input id="email" v-model="formData.email" type="email" autocomplete="email" maxlength="254" required class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all" :placeholder="t('contact.email')" />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">{{ t('contact.message') }}</label>
          <textarea id="message" v-model="formData.message" rows="5" maxlength="2000" required class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all resize-none" :placeholder="t('contact.message')" />
        </div>
        <p v-if="error" role="alert" class="text-sm text-[var(--md-sys-color-error)]">{{ error }}</p>
        <AButton type="submit" size="lg" class="w-full" :disabled="sending" :aria-busy="sending">{{ sending ? t('contact.sending') : t('contact.send') }}</AButton>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-heading {
  margin-bottom: 2rem;
  text-align: center;
}

.contact-heading h2 {
  margin-top: 0.75rem;
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.2rem, 4.5vw, 3.8rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1.05;
}

.contact-section form {
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1.25rem;
  background: var(--md-sys-color-surface);
  box-shadow: 0 1.5rem 4rem -3rem color-mix(in srgb, var(--md-sys-color-on-surface) 35%, transparent);
}

.contact-section input,
.contact-section textarea {
  border-radius: 0.8rem;
}

.contact-section input:focus,
.contact-section textarea:focus {
  border-color: var(--md-sys-color-primary);
}
</style>
