<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { inquiries, loadInquiries } = useAdmin()
onMounted(() => loadInquiries())

const fmt = (ts: number) => new Date(ts).toLocaleString()
</script>

<template>
  <div class="space-y-12">
    <section>
      <h1 class="mb-6 text-2xl font-bold">Portfolio Items</h1>
      <p class="mb-6 text-sm text-[var(--md-sys-color-on-surface-variant)]">
        These feed the "Live Projects" and "Templates" sections on the homepage.
      </p>
      <OAdminItems />
    </section>

    <section>
      <h2 class="mb-4 text-xl font-bold">Site content</h2>
      <p class="mb-6 text-sm text-[var(--md-sys-color-on-surface-variant)]">
        Editable About Us wording and Contact Us info (email, phone, location).
      </p>
      <OAdminContent />
    </section>

    <section>
      <h2 class="mb-4 text-xl font-bold">Inquiries</h2>
      <p v-if="!inquiries.length" class="text-sm text-[var(--md-sys-color-on-surface-variant)]">No inquiries yet.</p>
      <ul v-else class="space-y-3">
        <li v-for="q in inquiries" :key="q.id" class="rounded-2xl bg-[var(--md-sys-color-surface-container)] p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-semibold">{{ q.name }}</span>
            <span class="text-xs text-[var(--md-sys-color-on-surface-variant)]">{{ fmt(q.created_at) }}</span>
          </div>
          <div class="mt-1 text-sm text-[var(--md-sys-color-on-surface-variant)]">{{ q.email }}</div>
          <p class="mt-2 text-sm">{{ q.message }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>
