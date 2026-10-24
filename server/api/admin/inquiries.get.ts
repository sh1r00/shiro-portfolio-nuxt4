import { requireAdmin } from '../../utils/requireAdmin'
import { all } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return all('SELECT id, name, email, message, created_at FROM contact_inquiries ORDER BY created_at DESC LIMIT 200')
})
