import { requireAdmin } from '../../../utils/requireAdmin'
import { run } from '../../../utils/db'
import { requireString, requireUrl, optionalString, requireInt, requireKind } from '../../../utils/validate'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const title = requireString(body?.title, 200, 'title')
  const url = requireUrl(body?.url)
  const thumbnail = optionalString(body?.thumbnail, 500)
  const kind = requireKind(body?.kind)
  const sortOrder = body?.sort_order == null ? 0 : requireInt(body.sort_order, 'sort_order')

  await run(
    'UPDATE portfolio_items SET title = ?, url = ?, thumbnail = ?, kind = ?, sort_order = ? WHERE id = ?',
    [title, url, thumbnail, kind, sortOrder, id],
  )
  return { ok: true }
})
