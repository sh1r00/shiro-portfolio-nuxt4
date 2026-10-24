// Client-side route guard (UX only). The real gate is server-side `requireAdmin` on
// every /api/admin/* route. Never guard /admin/login with this (redirect loop).
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return
  try {
    const { authenticated } = await $fetch('/api/admin/session', { credentials: 'include' })
    if (!authenticated) return navigateTo('/admin/login')
  } catch {
    return navigateTo('/admin/login')
  }
})
