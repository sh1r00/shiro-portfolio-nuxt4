import { readFile } from 'node:fs/promises'
import { stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
}

// Serve runtime-uploaded thumbnails from public/uploads/. Nitro only serves the
// build-time copy of public/ in production, so runtime uploads need this route.
export default defineEventHandler(async (event) => {
  const rel = (getRouterParam(event, 'path') || '').replace(/\\/g, '/')
  const root = resolve(process.cwd(), 'public', 'uploads')
  const target = resolve(root, rel)

  // Path-traversal guard: the resolved file must stay inside public/uploads/.
  if (target !== root && !target.startsWith(root + sep)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  const s = await stat(target).catch(() => null)
  if (!s?.isFile()) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const ext = rel.split('.').pop()?.toLowerCase() || ''
  setHeader(event, 'Content-Type', MIME[ext] || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return await readFile(target)
})
