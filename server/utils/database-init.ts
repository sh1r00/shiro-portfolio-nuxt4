import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import { exec, get, run } from './db'
import { getAdminSecret } from './session'
import { getRequestEnvironmentValue, isCloudflareRuntime } from './runtime-env'

const SEED: { title: string; url: string; thumbnail: string; kind: 'live' | 'template' }[] = [
  { title: 'Shop Tulu', url: 'https://shop-tulu.netlify.app', thumbnail: '/img/shop-tulu.png', kind: 'live' },
  { title: 'kPhone Marketing', url: 'https://marketing-campaign-gen.netlify.app', thumbnail: '', kind: 'live' },
  { title: 'Credit Wiz', url: 'https://credit-wizard-sh1r00-229.netlify.app', thumbnail: '/img/credit-wizard.png', kind: 'live' },
  { title: 'Money Conversion SPA', url: 'https://trading-bot-sh1r00-332.netlify.app', thumbnail: '/img/trading-bot.png', kind: 'live' },
  { title: 'Mehari Global Solutions', url: 'https://meti-site.onrender.com', thumbnail: '', kind: 'live' },
  { title: 'Skilled Trades Marketplace', url: 'https://trades-markets.netlify.app', thumbnail: '', kind: 'live' },
  { title: 'SH1R00 Portfolio', url: 'https://shiro-portfolio-sh1r00.netlify.app', thumbnail: '', kind: 'live' },
  { title: 'Yack-Shack', url: 'https://yack-shack.pages.dev', thumbnail: '', kind: 'live' },
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

const CONTENT_SEED: { key: string; value: string }[] = [
  { key: 'about_bio', value: 'I build fast, accessible web experiences with Nuxt 4, Vue 3, and a sharp eye for design — from concept to deployment.' },
  { key: 'contact_email', value: 'joedoe98210@gmail.com' },
  { key: 'contact_phone', value: '' },
  { key: 'contact_location', value: '' },
]

let initialization: Promise<void> | undefined

async function initializeDatabase(event: H3Event): Promise<void> {
  const secret = getAdminSecret(event)
  const production = isCloudflareRuntime(event)
    || getRequestEnvironmentValue(event, 'NODE_ENV') === 'production'

  if (production && (secret.length < 32 || secret.startsWith('dev-only-'))) {
    throw new Error('NUXT_ADMIN_SECRET must be set to a random value (32+ chars) in production.')
  }

  await exec(event, `CREATE TABLE IF NOT EXISTS portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'template',
    sort_order INTEGER NOT NULL DEFAULT 0
  )`)

  await exec(event, `CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER
  )`)

  await exec(event, `CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`)

  await exec(event, `CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  )`)

  const count = (await get<{ n: number }>(event, 'SELECT COUNT(*) AS n FROM portfolio_items'))?.n ?? 0
  if (count === 0) {
    for (const [index, item] of SEED.entries()) {
      await run(
        event,
        'INSERT INTO portfolio_items (title, url, thumbnail, kind, sort_order) VALUES (?, ?, ?, ?, ?)',
        [item.title, item.url, item.thumbnail, item.kind, index],
      )
    }
  }

  const adminCount = (await get<{ n: number }>(event, 'SELECT COUNT(*) AS n FROM admin_users'))?.n ?? 0
  if (adminCount === 0) {
    const username = getRequestEnvironmentValue(event, 'NUXT_ADMIN_USERNAME')
    const password = getRequestEnvironmentValue(event, 'NUXT_ADMIN_PASSWORD')
    if (username && password) {
      const hash = bcrypt.hashSync(password, 12)
      await run(event, 'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [username, hash])
    }
  }

  const contentCount = (await get<{ n: number }>(event, 'SELECT COUNT(*) AS n FROM site_content'))?.n ?? 0
  if (contentCount === 0) {
    for (const content of CONTENT_SEED) {
      await run(event, 'INSERT INTO site_content (key, value) VALUES (?, ?)', [content.key, content.value])
    }
  }
}

export function ensureDatabaseInitialized(event: H3Event): Promise<void> {
  if (!initialization) {
    initialization = initializeDatabase(event).catch((error: unknown) => {
      initialization = undefined
      throw error
    })
  }

  return initialization
}
