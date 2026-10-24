<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { login } = useAdmin()
const toast = useToastStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(username.value, password.value)
    router.push('/admin')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Login failed'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="flex min-h-[70vh] items-center justify-center py-20">
    <div class="w-full max-w-sm rounded-3xl bg-[var(--md-sys-color-surface-container)] p-8 shadow-lg">
      <h1 class="mb-6 text-2xl font-bold">Admin Login</h1>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="mb-2 block text-sm font-medium">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-4 py-2.5 text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]"
          />
        </div>
        <div>
          <label for="password" class="mb-2 block text-sm font-medium">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] px-4 py-2.5 text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]"
          />
        </div>
        <p v-if="error" role="alert" class="text-sm text-[var(--md-sys-color-error)]">{{ error }}</p>
        <AButton type="submit" size="lg" class="w-full" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </AButton>
      </form>
    </div>
  </section>
</template>
