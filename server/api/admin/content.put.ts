import { requireAdmin } from '../../utils/requireAdmin'
import { run } from '../../utils/db'

const ALLOWED_KEYS = ['about_bio', 'contact_email', 'contact_phone', 'contact_location']

// Admin — update editable site copy (key-value upsert, whitelisted keys only).
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
  for (const key of ALLOWED_KEYS) {
    if (typeof body[key] === 'string') {
      await run(
        'INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, body[key].slice(0, 5000)],
      )
    }
  }
  return { ok: true }
})
