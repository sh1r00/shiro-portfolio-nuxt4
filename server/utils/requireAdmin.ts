import { getAdminSession } from './session'

export async function requireAdmin(event: any) {
  const session = await getAdminSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session.data
}
