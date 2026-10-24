import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// i18n lockstep: every user-facing string key must exist (and be nested identically)
// in all three locale files. Adding a key to en.json without es.json/am.json fails here.

function deepKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k
    keys.push(full)
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...deepKeys(v as Record<string, unknown>, full))
    }
  }
  return keys.sort()
}

function load(locale: string): Record<string, unknown> {
  const p = resolve(process.cwd(), 'i18n', 'locales', `${locale}.json`)
  return JSON.parse(readFileSync(p, 'utf-8')) as Record<string, unknown>
}

describe('i18n lockstep (en/es/am)', () => {
  it('has identical key structure across all three locales', () => {
    const en = deepKeys(load('en'))
    const es = deepKeys(load('es'))
    const am = deepKeys(load('am'))

    expect(es).toEqual(en)
    expect(am).toEqual(en)
  })

  it('no locale file is empty or malformed', () => {
    for (const locale of ['en', 'es', 'am']) {
      const data = load(locale)
      expect(Object.keys(data).length).toBeGreaterThan(5)
    }
  })
})
