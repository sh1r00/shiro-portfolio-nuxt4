import type { WorkItem } from './useWorks'

export interface Inquiry {
  id: number
  name: string
  email: string
  message: string
  created_at: number
}

// Admin auth + works/inquiries CRUD. All mutations use `credentials:'include'` so the
// signed session cookie is sent; CSRF is covered by the SameSite=lax cookie (single-user
// admin) — nuxt-security's xssValidator/csrf are disabled to avoid POST-body breakage.
export function useAdmin() {
  const toast = useToastStore()
  const items = ref<WorkItem[]>([])
  const inquiries = ref<Inquiry[]>([])
  const loading = ref(false)

  async function login(username: string, password: string) {
    await $fetch('/api/admin/login', { method: 'POST', credentials: 'include', body: { username, password } })
  }

  async function logout() {
    await $fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
  }

  async function loadItems() {
    loading.value = true
    try {
      items.value = await $fetch<WorkItem[]>('/api/admin/items', { credentials: 'include' })
    } catch (e: any) {
      toast.error(e?.data?.statusMessage || 'Failed to load items')
    } finally {
      loading.value = false
    }
  }

  async function createItem(payload: { title: string; url: string; thumbnail: string; kind: 'live' | 'template'; sort_order: number }) {
    await $fetch('/api/admin/items', { method: 'POST', credentials: 'include', body: payload })
    toast.success('Item added')
    await loadItems()
  }

  async function updateItem(id: number, payload: { title: string; url: string; thumbnail: string; kind: 'live' | 'template'; sort_order: number }) {
    await $fetch(`/api/admin/items/${id}`, { method: 'PUT', credentials: 'include', body: payload })
    toast.success('Item updated')
    await loadItems()
  }

  async function deleteItem(id: number) {
    await $fetch(`/api/admin/items/${id}`, { method: 'DELETE', credentials: 'include' })
    toast.success('Item deleted')
    await loadItems()
  }

  async function loadInquiries() {
    try {
      inquiries.value = await $fetch<Inquiry[]>('/api/admin/inquiries', { credentials: 'include' })
    } catch (e: any) {
      toast.error(e?.data?.statusMessage || 'Failed to load inquiries')
    }
  }

  return { items, inquiries, loading, login, logout, loadItems, createItem, updateItem, deleteItem, loadInquiries }
}
