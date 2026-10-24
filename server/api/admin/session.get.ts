import { getAdminSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  return { authenticated: !!session.data.userId }
})
