import { createClient } from '@libsql/client'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

// libSQL (Turso) — serverless + free. Remote `libsql://` in production, local `file:`
// in dev (no Turso account needed to run locally). Swapping the driver later is a
// one-file change: only these helpers know about @libsql/client.
const url = process.env.TURSO_DATABASE_URL || 'file:./server/data/portfolio.db'
const authToken = process.env.TURSO_AUTH_TOKEN || ''

// The local `file:` engine does not create parent directories — do it here.
if (url.startsWith('file:')) {
  mkdirSync(dirname(resolve(process.cwd(), url.slice('file:'.length))), { recursive: true })
}

const client = createClient(url.startsWith('libsql://') ? { url, authToken } : { url })

export async function exec(sql: string) {
  return client.execute(sql)
}

export async function get<T = any>(sql: string, args: any[] = []): Promise<T | undefined> {
  const r = await client.execute({ sql, args })
  return (r.rows[0] as T) ?? undefined
}

export async function all<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const r = await client.execute({ sql, args })
  return r.rows as T[]
}

// Run a write; returns the last insert row id (0 for updates/deletes).
export async function run(sql: string, args: any[] = []): Promise<number> {
  const r = await client.execute({ sql, args })
  return Number(r.lastInsertRowid ?? 0)
}

export default client
