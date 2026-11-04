// Capture fresh screenshots of every template into public/img/.
// Run: node scripts/capture-templates.mjs
import { chromium } from '@playwright/test'

const templates = [
  { slug: 'restaurant-editable', url: 'https://restaurant-editable.pages.dev' },
  { slug: 'restaurant-horizontal', url: 'https://restaurant-horizontal.pages.dev' },
  { slug: 'restaurant-vertical', url: 'https://restaurant-vertical-5k0.pages.dev' },
  { slug: 'construction-site', url: 'https://construction-site-373.pages.dev' },
  { slug: 'realty-creditors', url: 'https://realty-creditors.pages.dev' },
  { slug: 'editable-landing-page', url: 'https://editable-landing-page.pages.dev' },
  { slug: 'affiliate-page', url: 'https://affiliate-page-7qg.pages.dev' },
  { slug: 'medical-site', url: 'https://medical-site-a0h.pages.dev' },
  { slug: 'photography-site', url: 'https://photography-site-3yg.pages.dev' },
  { slug: 'your-blog', url: 'https://your-blog.pages.dev' },
  { slug: 'bael-template', url: 'https://bael-template.pages.dev' },
  { slug: 'bike-store', url: 'https://bike-store-dxg.pages.dev' },
]

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })

for (const t of templates) {
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `public/img/${t.slug}.png` })
    console.log(`OK   ${t.slug}`)
  } catch (e) {
    console.error(`FAIL ${t.slug}: ${e.message.split('\n')[0]}`)
  }
}

await browser.close()
console.log('done')
