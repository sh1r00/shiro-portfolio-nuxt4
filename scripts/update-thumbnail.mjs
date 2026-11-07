// One-off admin: update a work item's thumbnail in the portfolio Turso DB.
// Usage: node scripts/update-thumbnail.mjs "<Title>" "<thumbnailUrl>"
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

const [title, thumbnail] = process.argv.slice(2)
if (!title) {
  console.error('usage: node scripts/update-thumbnail.mjs "<Title>" "<thumbnailUrl>"')
  process.exit(1)
}

const client = createClient({ url, authToken })
const r = await client.execute({
  sql: 'UPDATE portfolio_items SET thumbnail = ? WHERE title = ?',
  args: [thumbnail, title],
})
console.log(`✓ updated ${r.rowsAffected} row(s) for "${title}"`)
