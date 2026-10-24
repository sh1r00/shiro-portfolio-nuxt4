import { all } from '../utils/db'

// Public — feeds the "Live Projects" + "Templates" sections. Live first, then
// templates, each ordered by sort_order.
export default defineEventHandler(async () => {
  const items = await all<{ id: number; title: string; url: string; thumbnail: string; kind: string }>(
    `SELECT id, title, url, thumbnail, kind, sort_order
     FROM portfolio_items
     ORDER BY CASE kind WHEN 'live' THEN 0 ELSE 1 END, sort_order ASC`,
  )
  return {
    live: items.filter((i) => i.kind === 'live'),
    templates: items.filter((i) => i.kind === 'template'),
  }
})
