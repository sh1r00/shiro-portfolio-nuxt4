import { run } from '../utils/db'
import { requireString } from '../utils/validate'

// Contact form — persists to SQLite (surfaces in the admin "Inquiries" list).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = requireString(body?.name, 100, 'name')
  const email = requireString(body?.email, 254, 'email')
  const message = requireString(body?.message, 2000, 'message')

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }

  await run(
    'INSERT INTO contact_inquiries (name, email, message, created_at) VALUES (?, ?, ?, ?)',
    [name, email, message, Date.now()],
  )
  return { ok: true }
})
