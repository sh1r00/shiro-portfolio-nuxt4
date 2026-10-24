import bcrypt from 'bcryptjs'
import { get, run } from '../../utils/db'
import { getAdminSession } from '../../utils/session'

const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000 // 15 minutes

interface AdminUser {
  id: number
  username: string
  password_hash: string
  failed_attempts: number
  locked_until: number | null
}

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const now = Date.now()

  const user = await get<AdminUser>(
    'SELECT id, username, password_hash, failed_attempts, locked_until FROM admin_users WHERE username = ?',
    [username],
  )

  // Locked account: reject early without revealing whether the password was correct.
  if (user && user.locked_until && user.locked_until > now) {
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Try again later.' })
  }

  const ok = !!user && typeof password === 'string' && (await bcrypt.compare(password, user.password_hash))

  if (!ok) {
    // Per-username lockout (DB-backed). An unknown username has no row to lock — return
    // the same generic 401 to avoid account enumeration.
    if (user) {
      const attempts = user.failed_attempts + 1
      if (attempts >= MAX_ATTEMPTS) {
        await run('UPDATE admin_users SET failed_attempts = 0, locked_until = ? WHERE id = ?', [now + LOCK_MS, user.id])
      } else {
        await run('UPDATE admin_users SET failed_attempts = ? WHERE id = ?', [attempts, user.id])
      }
    }
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  // Success: reset the counter and start a session.
  await run('UPDATE admin_users SET failed_attempts = 0, locked_until = NULL WHERE id = ?', [user.id])
  const session = await getAdminSession(event)
  await session.update({ userId: user.id, username: user.username })
  return { ok: true }
})
