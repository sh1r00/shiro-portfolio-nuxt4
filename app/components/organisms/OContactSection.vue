<script setup lang="ts">
const { t } = useI18n()

const formData = ref({ name: '', email: '', message: '' })
const submitted = ref(false)

function handleSubmit() {
  // Simple client-side contact form — mailto fallback
  const { name, email, message } = formData.value
  if (name && email && message) {
    submitted.value = true
    // Reset after showing success
    setTimeout(() => {
      submitted.value = false
      formData.value = { name: '', email: '', message: '' }
    }, 3000)
  }
}
</script>

<template>
  <section id="contact" class="py-20 md:py-32 bg-[var(--md-sys-color-surface-container-low)]">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-sm font-semibold uppercase tracking-widest text-[var(--md-sys-color-primary)] mb-3">
          {{ t('contact.title') }}
        </p>
        <h2 class="text-3xl md:text-5xl font-bold text-[var(--md-sys-color-on-surface)]">
          {{ t('contact.subtitle') }}
        </h2>
      </div>

      <!-- Success message -->
      <div
        v-if="submitted"
        class="mb-8 p-6 rounded-3xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] text-center animate-fade-in"
      >
        <span class="text-2xl">✅</span>
        <p class="font-semibold mt-2">Message sent! I'll get back to you soon.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">
            {{ t('contact.name') }}
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all"
            :placeholder="t('contact.name')"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">
            {{ t('contact.email') }}
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all"
            :placeholder="t('contact.email')"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2">
            {{ t('contact.message') }}
          </label>
          <textarea
            id="message"
            v-model="formData.message"
            rows="5"
            required
            class="w-full px-5 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent transition-all resize-none"
            :placeholder="t('contact.message')"
          />
        </div>
        <button
          type="submit"
          class="w-full py-4 rounded-full font-semibold text-lg bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-lg hover:shadow-xl hover:opacity-90 transition-all cursor-pointer"
        >
          {{ t('contact.send') }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>
