// Update portfolio_items.thumbnail for the 9 templates that had empty thumbnails.
// Reads TURSO_* from .env directly (never prints credential values).
// Run: node scripts/update-template-thumbnails.mjs
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
  { host: 'restaurant-horizontal.pages.dev', thumb: '/img/restaurant-horizontal.png' },
  { host: 'restaurant-vertical-5k0.pages.dev', thumb: '/img/restaurant-vertical.png' },
  { host: 'construction-site-373.pages.dev', thumb: '/img/construction-site.png' },
  { host: 'editable-landing-page.pages.dev', thumb: '/img/editable-landing-page.png' },
  { host: 'affiliate-page-7qg.pages.dev', thumb: '/img/affiliate-page.png' },
  { host: 'medical-site-a0h.pages.dev', thumb: '/img/medical-site.png' },
  { host: 'photography-site-3yg.pages.dev', thumb: '/img/photography-site.png' },
  { host: 'bael-template.pages.dev', thumb: '/img/bael-template.png' },
  { host: 'bike-store-dxg.pages.dev', thumb: '/img/bike-store.png' },
]

for (const u of updates) {
  const r = await client.execute({
    sql: 'UPDATE portfolio_items SET thumbnail = ? WHERE url LIKE ?',
    args: [u.thumb, `%${u.host}%`],
  })
  console.log(`${r.rowsAffected} row(s) → ${u.thumb}`)
}

await client.close()
console.log('done')
