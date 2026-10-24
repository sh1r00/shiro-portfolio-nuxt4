import { requireAdmin } from '../../../utils/requireAdmin'
import { run } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  await run('DELETE FROM portfolio_items WHERE id = ?', [id])
  return { ok: true }
})
