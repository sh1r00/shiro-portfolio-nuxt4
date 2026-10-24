import { requireAdmin } from '../../utils/requireAdmin'
import { run } from '../../utils/db'
import { requireString, requireUrl, optionalString, requireInt, requireKind } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const title = requireString(body?.title, 200, 'title')
  const url = requireUrl(body?.url)
  const thumbnail = optionalString(body?.thumbnail, 500)
  const kind = requireKind(body?.kind)
  const sortOrder = body?.sort_order == null ? 0 : requireInt(body.sort_order, 'sort_order')

  const id = await run(
    'INSERT INTO portfolio_items (title, url, thumbnail, kind, sort_order) VALUES (?, ?, ?, ?, ?)',
    [title, url, thumbnail, kind, sortOrder],
  )
  return { ok: true, id }
})
