<script setup lang="ts">
interface WorkloadResult {
  title: string
  url: string
  ok: boolean
  status: number
  ms: number
  error?: string
}

const status = ref<{ checkedAt: string; up: number; total: number; results: WorkloadResult[] } | null>(null)
const lastChecked = ref('—')
const loading = ref(true)
const REFRESH_MS = 30000
let timer: ReturnType<typeof setInterval> | null = null

async function check() {
  loading.value = true
  try {
    status.value = await $fetch('/api/workload')
    lastChecked.value = new Date().toLocaleTimeString()
  } catch {
    // keep last-known status on error
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  check()
  timer = setInterval(check, REFRESH_MS)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const upCount = computed(() => status.value?.up ?? 0)
const totalCount = computed(() => status.value?.total ?? 0)

function hostname(url: string) {
  try { return new URL(url).hostname } catch { return url }
}
</script>

<template>
  <div class="workload">
    <header class="workload-head">
      <NuxtLink to="/" class="workload-back">← Back to portfolio</NuxtLink>
      <p class="workload-kicker">LIVE WORKLOAD</p>
      <h1>Site status</h1>
      <p class="workload-sub">
        Auto-refreshes every {{ REFRESH_MS / 1000 }}s — reflects the live sites' current state.
      </p>
      <div class="workload-summary">
        <span class="workload-pill" :class="upCount === totalCount && totalCount > 0 ? 'ok' : 'warn'">
          {{ upCount }}/{{ totalCount }} up
        </span>
        <span class="workload-last">Last checked {{ lastChecked }}</span>
        <button class="workload-refresh" :disabled="loading" @click="check">
          {{ loading ? 'Checking…' : 'Refresh' }}
        </button>
      </div>
    </header>

    <ul class="workload-list" aria-live="polite">
      <li v-for="r in status?.results" :key="r.url" class="workload-row">
        <span class="workload-dot" :class="r.ok ? 'ok' : 'down'" aria-hidden="true" />
        <div class="workload-meta">
          <span class="workload-title">{{ r.title }}</span>
          <a class="workload-url" :href="r.url" target="_blank" rel="noopener noreferrer">{{ hostname(r.url) }}</a>
        </div>
        <span class="workload-state" :class="r.ok ? 'ok' : 'down'">
          {{ r.ok ? 'UP' : r.status === 0 ? 'DOWN' : r.status }}
        </span>
        <span class="workload-ms">{{ r.ms }}ms</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.workload {
  max-width: 46rem;
  margin: 0 auto;
  padding: 6rem 1.25rem 4rem;
  background: var(--md-sys-color-surface);
}
.workload-back {
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--md-sys-color-primary);
  font-size: 0.85rem;
  font-weight: 650;
}
.workload-kicker {
  margin-bottom: 0.5rem;
  color: var(--md-sys-color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.workload-head h1 {
  color: var(--md-sys-color-on-surface);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.6rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
}
.workload-sub {
  margin-top: 1rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.95rem;
  line-height: 1.6;
}
.workload-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}
.workload-pill {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}
.workload-pill.ok { background: color-mix(in srgb, #248b56 18%, transparent); color: #2fae6a; }
.workload-pill.warn { background: color-mix(in srgb, #e0a400 18%, transparent); color: #d19a00; }
.workload-last {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.82rem;
}
.workload-refresh {
  margin-left: auto;
  padding: 0.45rem 1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  background: transparent;
  color: var(--md-sys-color-on-surface);
  font-size: 0.82rem;
  font-weight: 650;
  cursor: pointer;
}
.workload-refresh:hover { border-color: var(--md-sys-color-primary); }
.workload-refresh:disabled { opacity: 0.55; cursor: wait; }
.workload-list {
  margin-top: 2rem;
  display: grid;
  gap: 0.6rem;
}
.workload-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 0.9rem;
  padding: 0.95rem 1.1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1rem;
  background: var(--md-sys-color-surface-container-low);
}
.workload-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
}
.workload-dot.ok { background: #2fae6a; }
.workload-dot.down { background: #d94f4f; }
.workload-meta { display: grid; gap: 0.15rem; min-width: 0; }
.workload-title { color: var(--md-sys-color-on-surface); font-weight: 650; font-size: 0.9rem; }
.workload-url { color: var(--md-sys-color-on-surface-variant); font-size: 0.75rem; text-decoration: none; }
.workload-url:hover { color: var(--md-sys-color-primary); }
.workload-state { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; }
.workload-state.ok { color: #2fae6a; }
.workload-state.down { color: #d94f4f; }
.workload-ms { color: var(--md-sys-color-on-surface-variant); font-size: 0.78rem; font-variant-numeric: tabular-nums; }
</style>
