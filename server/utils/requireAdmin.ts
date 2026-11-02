import type { H3Event } from 'h3'
import { getAdminSession } from './session'

export async function requireAdmin(event: H3Event) {
  const session = await getAdminSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session.data
}
