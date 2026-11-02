import { createClient } from '@libsql/client'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { H3Event } from 'h3'
import { getRequestEnvironmentValue, isCloudflareRuntime } from './runtime-env'

let client: ReturnType<typeof createClient> | undefined
let clientUrl: string | undefined
let clientAuthToken: string | undefined

function getClient(event: H3Event) {
  const isWorker = isCloudflareRuntime(event)
  const configuredUrl = getRequestEnvironmentValue(event, 'TURSO_DATABASE_URL')
  const url = configuredUrl || (isWorker ? '' : 'file:./server/data/portfolio.db')
  const authToken = getRequestEnvironmentValue(event, 'TURSO_AUTH_TOKEN') || ''

  if (!url) {
    throw new Error('TURSO_DATABASE_URL must be configured for Cloudflare Workers.')
  }
  if (isWorker && url.startsWith('file:')) {
    throw new Error('Cloudflare Workers require a remote TURSO_DATABASE_URL.')
  }
  if (url.startsWith('libsql://') && !authToken) {
    throw new Error('TURSO_AUTH_TOKEN must be configured for the remote Turso database.')
  }

  if (url.startsWith('file:')) {
    mkdirSync(dirname(resolve(process.cwd(), url.slice('file:'.length))), { recursive: true })
  }

  if (!client || clientUrl !== url || clientAuthToken !== authToken) {
    client = createClient(url.startsWith('libsql://') ? { url, authToken } : { url })
    clientUrl = url
    clientAuthToken = authToken
  }

  return client
}

export async function exec(event: H3Event, sql: string) {
  return getClient(event).execute(sql)
}

export async function get<T = any>(event: H3Event, sql: string, args: any[] = []): Promise<T | undefined> {
  const r = await getClient(event).execute({ sql, args })
  return (r.rows[0] as T) ?? undefined
}

export async function all<T = any>(event: H3Event, sql: string, args: any[] = []): Promise<T[]> {
  const r = await getClient(event).execute({ sql, args })
  return r.rows as T[]
}

// Run a write; returns the last insert row id (0 for updates/deletes).
export async function run(event: H3Event, sql: string, args: any[] = []): Promise<number> {
  const r = await getClient(event).execute({ sql, args })
  return Number(r.lastInsertRowid ?? 0)
}
