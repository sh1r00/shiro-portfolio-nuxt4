<script setup lang="ts">
import type { WorkItem } from '~/composables/useWorks'

const { items, loading, loadItems, createItem, updateItem, deleteItem } = useAdmin()

const editing = ref<WorkItem | null>(null)
const showForm = ref(false)
const saving = ref(false)
const form = reactive({ title: '', url: '', thumbnail: '', kind: 'template' as 'live' | 'template', sort_order: 0 })

function openCreate() {
  Object.assign(form, { title: '', url: '', thumbnail: '', kind: 'template', sort_order: 0 })
  editing.value = null
  showForm.value = true
}

function openEdit(item: WorkItem) {
  Object.assign(form, { title: item.title, url: item.url, thumbnail: item.thumbnail || '', kind: item.kind, sort_order: item.sort_order })
  editing.value = item
  showForm.value = true
}

async function save() {
  saving.value = true
  try {
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 }
    if (editing.value) await updateItem(editing.value.id, payload)
    else await createItem(payload)
    showForm.value = false
  } catch {
    // error toast is surfaced in useAdmin
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Delete this item?')) return
  await deleteItem(id)
}

onMounted(() => loadItems())
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <AButton size="sm" @click="openCreate">+ Add item</AButton>
      <span v-if="loading" class="text-sm text-[var(--md-sys-color-on-surface-variant)]">Loading…</span>
    </div>

    <form v-if="showForm" class="mb-6 rounded-2xl bg-[var(--md-sys-color-surface-container)] p-6" @submit.prevent="save">
      <h2 class="mb-4 font-semibold">{{ editing ? 'Edit' : 'Add' }} item</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium">Title</label>
          <input v-model="form.title" type="text" required class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-3 py-2" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">URL</label>
          <input v-model="form.url" type="url" required placeholder="https://…" class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-3 py-2" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">Thumbnail path (optional)</label>
          <input v-model="form.thumbnail" type="text" placeholder="/img/name.png" class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-3 py-2" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-sm font-medium">Kind</label>
            <select v-model="form.kind" class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-3 py-2">
              <option value="template">Template</option>
              <option value="live">Live</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">Sort order</label>
            <input v-model="form.sort_order" type="number" class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-3 py-2" />
          </div>
        </div>
      </div>
      <div class="mt-4 flex gap-3">
        <AButton type="submit" size="sm" :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</AButton>
        <AButton variant="text" size="sm" @click="showForm = false">Cancel</AButton>
      </div>
    </form>

    <div class="overflow-x-auto rounded-2xl border border-[var(--md-sys-color-outline-variant)]">
      <table class="w-full text-left text-sm">
        <thead class="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)]">
          <tr>
            <th class="px-4 py-3 font-medium">Title</th>
            <th class="px-4 py-3 font-medium">URL</th>
            <th class="px-4 py-3 font-medium">Kind</th>
            <th class="px-4 py-3 font-medium">Sort</th>
            <th class="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-[var(--md-sys-color-outline-variant)]">
            <td class="px-4 py-3 font-medium">{{ item.title }}</td>
            <td class="max-w-[240px] truncate px-4 py-3 text-[var(--md-sys-color-on-surface-variant)]">{{ item.url }}</td>
            <td class="px-4 py-3">
              <ABadge :color="item.kind === 'live' ? 'tertiary' : 'secondary'" variant="small">{{ item.kind }}</ABadge>
            </td>
            <td class="px-4 py-3 text-[var(--md-sys-color-on-surface-variant)]">{{ item.sort_order }}</td>
            <td class="px-4 py-3 text-right">
              <button type="button" class="mr-3 text-[var(--md-sys-color-primary)] hover:underline" @click="openEdit(item)">Edit</button>
              <button type="button" class="text-[var(--md-sys-color-error)] hover:underline" @click="remove(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
