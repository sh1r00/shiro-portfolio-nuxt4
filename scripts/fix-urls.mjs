// One-off admin: fix stale/wrong URLs in the portfolio Turso DB.
// Usage: node scripts/fix-urls.mjs
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

// title -> correct live URL
const FIXES = [
  // live projects
  ['Credit Wiz', 'https://credit-wizard.pages.dev'],
  // templates — .pages.dev (dead) -> .netlify.app (actual host)
  ['Savora Restaurant', 'https://restaurant-editable.netlify.app'],
  ['Terra & Flame', 'https://restaurant-horizontal.netlify.app'],
  ['Restaurant Vertical', 'https://restaurant-vertical.netlify.app'],
  ['SH1R00 Construction', 'https://construct-site-sh1r00-239.netlify.app'],
  ['Realty Creditors', 'https://realty-creditors.netlify.app'],
  ['Sh1r00 Digital', 'https://landing-page-sh1r00-946.netlify.app'],
  ['Affiliate Page', 'https://affiliate-page-sh1r00-691.netlify.app'],
  ['Medical Site', 'https://medical-site-sh1r00-972.netlify.app'],
  ['Photography Site', 'https://photo-site-sh1r00-427.netlify.app'],
  ['DevBlog', 'https://your-blog-sh1r00-623.netlify.app'],
  ['Bael Template', 'https://bael-template-sh1r00-814.netlify.app'],
  ['Urban Ride Bikes', 'https://bike-store-sh1r00-817.netlify.app'],
]

const client = createClient({ url, authToken })
let total = 0
for (const [title, newUrl] of FIXES) {
  const r = await client.execute({
    sql: 'UPDATE portfolio_items SET url = ? WHERE title = ?',
    args: [newUrl, title],
  })
  total += r.rowsAffected
  console.log(`  [${r.rowsAffected > 0 ? 'OK' : 'MISS'}] "${title}" -> ${newUrl}`)
}
console.log(`\n✓ ${total} row(s) updated`)
