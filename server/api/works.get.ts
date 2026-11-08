import { all } from '../utils/db'

// Public — feeds the "Live Projects", "Upcoming" and "Templates" sections.
// Live first, then upcoming, then templates, each ordered by sort_order.
export default defineEventHandler(async (event) => {
  const items = await all<{ id: number; title: string; url: string; thumbnail: string; kind: string }>(
    event,
    `SELECT id, title, url, thumbnail, kind, sort_order
     FROM portfolio_items
     ORDER BY CASE kind WHEN 'live' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END, sort_order ASC`,
  )
  return {
    live: items.filter((i) => i.kind === 'live'),
    upcoming: items.filter((i) => i.kind === 'upcoming'),
    templates: items.filter((i) => i.kind === 'template'),
  }
})
