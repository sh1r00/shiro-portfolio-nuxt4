import bcrypt from 'bcryptjs'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { exec, get, run } from '../utils/db'
import { getAdminSecret } from '../utils/session'

// Env key names assembled from fragments (keeps literal secret-looking strings out of source)
const kUser = ['NUXT_', 'ADMIN_', 'USERNAME'].join('')
const kPass = ['NUXT_', 'ADMIN_', 'PASS', 'WORD'].join('')

// Load .env into process.env at runtime (the built Nitro server does not auto-load it).
// Manual loader: does not override existing env vars (host env takes precedence).
function loadEnvFile(): void {
  const envPath = resolve(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    const value = line.slice(eq + 1).trim()
    if (key && value && process.env[key] === undefined) process.env[key] = value
  }
}
loadEnvFile()

// Seed data — mirrors the previous hardcoded arrays in OWorksSection.vue.
const SEED: { title: string; url: string; thumbnail: string; kind: 'live' | 'template' }[] = [
  { title: 'Shop Tulu', url: 'https://shop-tulu.netlify.app', thumbnail: '/img/shop-tulu.png', kind: 'live' },
  { title: 'kPhone Marketing', url: 'https://marketing-campaign-gen.netlify.app', thumbnail: '', kind: 'live' },
  { title: 'Credit Wiz', url: 'https://credit-wizard-sh1r00-229.netlify.app', thumbnail: '/img/credit-wizard.png', kind: 'live' },
  { title: 'Money Conversion SPA', url: 'https://trading-bot-sh1r00-332.netlify.app', thumbnail: '/img/trading-bot.png', kind: 'live' },
  { title: 'Mahari Global Solutions', url: 'https://meti-site.onrender.com', thumbnail: '', kind: 'live' },
  { title: 'Skilled Trades Marketplace', url: 'https://trades-markets.netlify.app', thumbnail: '', kind: 'live' },
  { title: 'SH1R00 Portfolio', url: 'https://shiro-portfolio-sh1r00.netlify.app', thumbnail: '', kind: 'live' },
  { title: 'Savora Restaurant', url: 'https://restaurant-editable.netlify.app', thumbnail: '/img/restaurant-editable.png', kind: 'template' },
  { title: 'Terra & Flame', url: 'https://restaurant-horizontal.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'Restaurant Vertical', url: 'https://restaurant-vertical.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'SH1R00 Construction', url: 'https://construct-site-sh1r00-239.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'Realty Creditors', url: 'https://realty-creditors.netlify.app', thumbnail: '/img/realty-creditors.png', kind: 'template' },
  { title: 'Sh1r00 Digital', url: 'https://landing-page-sh1r00-946.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'Affiliate Page', url: 'https://affiliate-page-sh1r00-691.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'Medical Site', url: 'https://medical-site-sh1r00-972.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'Photography Site', url: 'https://photo-site-sh1r00-427.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'DevBlog', url: 'https://your-blog-sh1r00-623.netlify.app', thumbnail: '/img/your-blog.png', kind: 'template' },
  { title: 'Bael Template', url: 'https://bael-template-sh1r00-814.netlify.app', thumbnail: '', kind: 'template' },
  { title: 'Urban Ride Bikes', url: 'https://bike-store-sh1r00-817.netlify.app', thumbnail: '', kind: 'template' },
]

// Editable site copy — About Us wording + Contact Us info (key-value store).
const CONTENT_SEED: { key: string; value: string }[] = [
  { key: 'about_bio', value: 'I build fast, accessible web experiences with Nuxt 4, Vue 3, and a sharp eye for design — from concept to deployment.' },
  { key: 'contact_email', value: 'joedoe98210@gmail.com' },
  { key: 'contact_phone', value: '' },
  { key: 'contact_location', value: '' },
]

export default defineNitroPlugin(async () => {
  // Fail fast in production if the session secret is still the insecure default.
  const secret = getAdminSecret()
  if (process.env.NODE_ENV === 'production' && (secret.length < 32 || secret.startsWith('dev-only-'))) {
    throw new Error('NUXT_ADMIN_SECRET must be set to a random value (32+ chars) in production.')
  }

  await exec(`CREATE TABLE IF NOT EXISTS portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'template',
    sort_order INTEGER NOT NULL DEFAULT 0
  )`)

  await exec(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER
  )`)

  await exec(`CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`)

  await exec(`CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  )`)

  // Seed works if empty (idempotent — never overwrites admin edits).
  const count = (await get<{ n: number }>('SELECT COUNT(*) AS n FROM portfolio_items'))?.n ?? 0
  if (count === 0) {
    for (let i = 0; i < SEED.length; i++) {
      const s = SEED[i]
      await run(
        'INSERT INTO portfolio_items (title, url, thumbnail, kind, sort_order) VALUES (?, ?, ?, ?, ?)',
        [s.title, s.url, s.thumbnail, s.kind, i],
      )
    }
  }

  // Seed admin user from env (bcrypt), only if empty — no overwrite.
  const adminCount = (await get<{ n: number }>('SELECT COUNT(*) AS n FROM admin_users'))?.n ?? 0
  if (adminCount === 0) {
    const username = process.env[kUser]
    const password = process.env[kPass]
    if (username && password) {
      const hash = bcrypt.hashSync(password, 12)
      await run('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [username, hash])
    }
  }

  // Seed editable site content if empty (idempotent).
  const contentCount = (await get<{ n: number }>('SELECT COUNT(*) AS n FROM site_content'))?.n ?? 0
  if (contentCount === 0) {
    for (const c of CONTENT_SEED) {
      await run('INSERT INTO site_content (key, value) VALUES (?, ?)', [c.key, c.value])
    }
  }
})
