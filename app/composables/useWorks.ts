export interface WorkItem {
  id: number
  title: string
  url: string
  thumbnail: string
  kind: 'live' | 'template' | 'upcoming'
  sort_order: number
}

// Public works data — fed from the DB via /api/works. Replaces the previously
// hardcoded arrays in OWorksSection.vue.
export function useWorks() {
  const toast = useToastStore()
  const { data, pending, error } = useAsyncData<{ live: WorkItem[]; templates: WorkItem[]; upcoming: WorkItem[] }>(
    'works',
    () => $fetch('/api/works'),
  )

  watch(error, (e) => {
    if (import.meta.client && e) {
      toast.error((e as any)?.data?.statusMessage || 'Failed to load projects')
    }
  })

  return {
    live: computed(() => data.value?.live || []),
    templates: computed(() => data.value?.templates || []),
    upcoming: computed(() => data.value?.upcoming || []),
    pending,
  }
}
