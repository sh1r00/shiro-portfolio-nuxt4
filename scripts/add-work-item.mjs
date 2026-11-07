// One-off admin: insert a work item into the portfolio's Turso DB.
// Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from ../.env (values never printed).
// Usage: node scripts/add-work-item.mjs "<Title>" "<url>" "<kind>" ["<thumbnail>"]
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@libsql/client'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = readFileSync(join(root, '.env'), 'utf8')
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1] || '').trim()

const url = get('TURSO_DATABASE_URL')
const authToken = get('TURSO_AUTH_TOKEN')
if (!url || !authToken) {
  console.error('✗ TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set in .env')
  process.exit(1)
}

const [title, siteUrl, kind, thumbnail = ''] = process.argv.slice(2)
if (!title || !siteUrl || !kind) {
  console.error('usage: node scripts/add-work-item.mjs "<Title>" "<url>" "<live|template>" ["<thumbnail>"]')
  process.exit(1)
}

const client = createClient({ url, authToken })

const { rows } = await client.execute(
  `SELECT MAX(sort_order) AS m FROM portfolio_items WHERE kind = ?`,
  [kind],
)
const next = (Number(rows[0]?.m ?? -1)) + 1

const r = await client.execute({
  sql: 'INSERT INTO portfolio_items (title, url, thumbnail, kind, sort_order) VALUES (?, ?, ?, ?, ?)',
  args: [title, siteUrl, thumbnail, kind, next],
})

console.log(`✓ inserted "${title}" (id=${r.lastInsertRowid}, kind=${kind}, sort_order=${next})`)
