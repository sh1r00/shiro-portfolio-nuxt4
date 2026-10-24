import { all } from '../utils/db'

// Public — editable site copy (About Us wording + Contact Us info) as a flat map.
export default defineEventHandler(async () => {
  const rows = await all<{ key: string; value: string }>('SELECT key, value FROM site_content')
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
})
