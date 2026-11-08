// One-off admin: move Yack-Shack to the new 'upcoming' category.
// Usage: node scripts/move-yack-shack-upcoming.mjs
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
  console.error('✗ TURSO creds missing in .env')
  process.exit(1)
}

const client = createClient({ url, authToken })
const r = await client.execute({
  sql: "UPDATE portfolio_items SET kind = 'upcoming' WHERE title = 'Yack-Shack'",
})
console.log(`✓ moved Yack-Shack → upcoming (${r.rowsAffected} row(s) affected)`)

const check = await client.execute({
  sql: "SELECT title, kind FROM portfolio_items WHERE title = 'Yack-Shack'",
})
console.log('  verify:', check.rows)
