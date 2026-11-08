import { requireAdmin } from '../../utils/requireAdmin'
import { all } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return all(
    event,
    `SELECT id, title, url, thumbnail, kind, sort_order
     FROM portfolio_items
     ORDER BY CASE kind WHEN 'live' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END, sort_order ASC`,
  )
})
