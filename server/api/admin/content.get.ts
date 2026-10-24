import { requireAdmin } from '../../utils/requireAdmin'
import { all } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const rows = await all<{ key: string; value: string }>('SELECT key, value FROM site_content')
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
})
