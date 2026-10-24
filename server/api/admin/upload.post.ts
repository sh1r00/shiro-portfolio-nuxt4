import { requireAdmin } from '../../utils/requireAdmin'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { randomBytes } from 'node:crypto'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const EXT_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/gif': '.gif',
}

// Admin thumbnail upload. Saves to public/uploads/ and returns the public path,
// which the admin form then writes into the item's `thumbnail` column.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'No file uploaded (use field name "file")' })

  const ext = EXT_BY_MIME[file.type || '']
  if (!ext) throw createError({ statusCode: 400, statusMessage: 'Unsupported type — use png/jpg/webp/svg/gif' })
  if (file.data.length > MAX_SIZE) throw createError({ statusCode: 413, statusMessage: 'Image too large (max 2MB)' })

  const name = `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}${ext}`
  const dir = resolve(process.cwd(), 'public', 'uploads')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, name), file.data)

  return { path: `/uploads/${name}` }
})
