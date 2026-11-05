// Fix the Credit Wiz URL: it was pointing at a non-existent Cloudflare Pages
// domain (522), but the project is a Netlify deploy at credit-wiz.netlify.app.
// Reads TURSO_* from .env directly (never prints credential values).
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
const r = await client.execute({
  sql: "UPDATE portfolio_items SET url = 'https://credit-wiz.netlify.app' WHERE url LIKE '%credit-wizard.pages.dev%'",
})
console.log(`${r.rowsAffected} row(s) updated → https://credit-wiz.netlify.app`)
await client.close()
