// Server-side input validation for admin writes. Admin write routes take `body.*`
// straight to the DB — this caps lengths and validates formats so oversized/bad input
// can't bloat the DB or smuggle a malformed URL past the frontend's `{{ }}` escaping.

export function requireString(v: unknown, maxLen: number, field: string): string {
  if (typeof v !== 'string') throw createError({ statusCode: 400, statusMessage: `${field} is required` })
  const s = v.trim()
  if (!s) throw createError({ statusCode: 400, statusMessage: `${field} is required` })
  if (s.length > maxLen) throw createError({ statusCode: 400, statusMessage: `${field} must be ${maxLen} characters or fewer` })
  return s
}

export function optionalString(v: unknown, maxLen: number): string {
  if (v == null || v === '') return ''
  if (typeof v !== 'string') return ''
  return v.trim().slice(0, maxLen)
}

export function requireUrl(v: unknown, field = 'url'): string {
  const s = requireString(v, 500, field)
  if (!/^https?:\/\//.test(s)) throw createError({ statusCode: 400, statusMessage: `${field} must start with http:// or https://` })
  return s
}

export function requireInt(v: unknown, field: string): number {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isInteger(n)) throw createError({ statusCode: 400, statusMessage: `${field} must be an integer` })
  return n
}

export function requireKind(v: unknown): 'live' | 'template' {
  if (v !== 'live' && v !== 'template') throw createError({ statusCode: 400, statusMessage: 'kind must be "live" or "template"' })
  return v
}
