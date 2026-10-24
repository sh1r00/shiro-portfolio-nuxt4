<script setup lang="ts">
const toast = useToastStore()

const form = ref({ about_bio: '', contact_email: '', contact_phone: '', contact_location: '' })
const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  try {
    const data = await $fetch<Record<string, string>>('/api/admin/content')
    form.value = { ...form.value, ...data }
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || 'Failed to load content')
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await $fetch('/api/admin/content', { method: 'PUT', body: form.value })
    toast.success('Content saved')
  } catch (e: any) {
    toast.error(e?.data?.statusMessage || 'Save failed')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form v-if="!loading" @submit.prevent="save" class="space-y-5">
    <div>
      <label for="ac-bio" class="block text-sm font-medium mb-1">About Us — bio</label>
      <textarea id="ac-bio" v-model="form.about_bio" rows="4" class="w-full px-4 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] resize-none" />
    </div>
    <div>
      <label for="ac-email" class="block text-sm font-medium mb-1">Contact — email</label>
      <input id="ac-email" v-model="form.contact_email" type="email" class="w-full px-4 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]" />
    </div>
    <div>
      <label for="ac-phone" class="block text-sm font-medium mb-1">Contact — phone (optional)</label>
      <input id="ac-phone" v-model="form.contact_phone" type="text" class="w-full px-4 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]" />
    </div>
    <div>
      <label for="ac-location" class="block text-sm font-medium mb-1">Contact — location (optional)</label>
      <input id="ac-location" v-model="form.contact_location" type="text" class="w-full px-4 py-3 rounded-2xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]" />
    </div>
    <AButton type="submit" size="md" :disabled="saving">{{ saving ? 'Saving…' : 'Save content' }}</AButton>
  </form>
</template>
