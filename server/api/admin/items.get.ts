import { requireAdmin } from '../../utils/requireAdmin'
import { all } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return all(
    `SELECT id, title, url, thumbnail, kind, sort_order
     FROM portfolio_items
     ORDER BY CASE kind WHEN 'live' THEN 0 ELSE 1 END, sort_order ASC`,
  )
})
