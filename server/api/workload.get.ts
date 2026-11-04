import { all } from '../utils/db'

// Live workload status — health-checks every live project (HTTP up/down + latency).
// Polled by /workload so the dashboard reflects the live sites' current state.
export default defineEventHandler(async (event) => {
  const items = await all<{ title: string; url: string }>(
    event,
    `SELECT title, url FROM portfolio_items WHERE kind = 'live' ORDER BY sort_order ASC`,
  )

  const results = await Promise.all(
    items.map(async (item) => {
      const start = Date.now()
      try {
        const res = await fetch(item.url, {
          method: 'GET',
          redirect: 'follow',
          signal: AbortSignal.timeout(9000),
        })
        return {
          title: item.title,
          url: item.url,
          ok: res.ok,
          status: res.status,
          ms: Date.now() - start,
        }
      } catch (e) {
        return {
          title: item.title,
          url: item.url,
          ok: false,
          status: 0,
          ms: Date.now() - start,
          error: e instanceof Error ? e.message : String(e),
        }
      }
    }),
  )

  return {
    checkedAt: new Date().toISOString(),
    up: results.filter(r => r.ok).length,
    total: results.length,
    results,
  }
})
