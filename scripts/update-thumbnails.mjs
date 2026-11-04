// Update portfolio_items.thumbnail for live projects that now have real screenshots.
// Reads TURSO_* from .env directly (never prints credential values).
// Run: node scripts/update-thumbnails.mjs
import { createClient } from '@libsql/client'
import { readFileSync } from 'node:fs'

const env = {}
for (const line of readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const url = env.TURSO_DATABASE_URL
const authToken = env.TURSO_AUTH_TOKEN
if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in .env')
  process.exit(1)
}

const client = createClient({ url, authToken })

const updates = [
  { host: 'marketing-gen.pages.dev', thumb: '/img/kphone-marketing.png' },
  { host: 'meti-site.onrender.com', thumb: '/img/meti-site.png' },
  { host: 'skilled-trades-marketplace.vercel.app', thumb: '/img/skilled-trades.png' },
  { host: 'sh1r00-dice-arena.rasisg.workers.dev', thumb: '/img/dice-arena.png' },
]

for (const u of updates) {
  const r = await client.execute({
    sql: 'UPDATE portfolio_items SET thumbnail = ? WHERE url LIKE ?',
    args: [u.thumb, `%${u.host}%`],
  })
  console.log(`${r.rowsAffected} row(s) updated → ${u.thumb}`)
}

await client.close()
console.log('done')
