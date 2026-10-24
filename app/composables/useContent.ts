export interface SiteContent {
  about_bio?: string
  contact_email?: string
  contact_phone?: string
  contact_location?: string
}

// Editable site copy (About Us wording + Contact Us info), fed from the DB via
// /api/content. Falls back to an empty object — components apply their own i18n defaults.
export function useContent() {
  const { data } = useAsyncData<SiteContent>('site-content', () => $fetch('/api/content'), {
    default: () => ({}),
  })
  return { content: computed(() => data.value || {}) }
}
