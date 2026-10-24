<script setup lang="ts">
const admin = useAdmin()
const router = useRouter()
const darkMode = useDarkModeStore()

onMounted(() => darkMode.initialize())

async function handleLogout() {
  await admin.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
    <header class="border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container)]">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <AIcon name="admin_panel_settings" size="md" />
          <span class="font-bold">shiro — Admin</span>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="text-xl opacity-70 hover:opacity-100"
            :aria-label="darkMode.isDark ? 'Light mode' : 'Dark mode'"
            @click="darkMode.toggle()"
          >
            {{ darkMode.isDark ? '☀️' : '🌙' }}
          </button>
          <NuxtLink to="/" class="text-sm text-[var(--md-sys-color-primary)] hover:underline">View site</NuxtLink>
          <AButton variant="outlined" size="sm" @click="handleLogout">Logout</AButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>

    <OToast />
  </div>
</template>
