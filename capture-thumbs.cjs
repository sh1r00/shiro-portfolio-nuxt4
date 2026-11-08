const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'public', 'img');

const SITES = [
  // LIVE
  { slug: 'kphone-marketing', url: 'https://marketing-gen.pages.dev' },
  { slug: 'shop-tulu', url: 'https://shop-tulu.pages.dev' },
  { slug: 'credit-wizard', url: 'https://credit-wizard.pages.dev' },
  { slug: 'trading-bot', url: 'https://trading-bot-dxt.pages.dev' },
  { slug: 'meti-site', url: 'https://meti-site.onrender.com' },
  { slug: 'skilled-trades', url: 'https://skilled-trades-marketplace.vercel.app' },
  { slug: 'dice-arena', url: 'https://sh1r00-dice-arena.rasisg.workers.dev' },
  // TEMPLATES
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
];

const results = { ok: [], fail: [] };

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let browser;
  for (const channel of ['chrome', 'msedge']) {
    try {
      browser = await chromium.launch({ channel });
      console.log(`[browser] launched with channel: ${channel}`);
      break;
    } catch (e) {
      console.log(`[browser] failed to launch channel ${channel}: ${e.message.split('\n')[0]}`);
    }
  }
  if (!browser) {
    console.error('[browser] FATAL: could not launch chrome or msedge');
    process.exit(2);
  }

  for (const { slug, url } of SITES) {
    const outPath = path.join(OUT_DIR, `${slug}.png`);
    let page = null;
    try {
      page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(6000);
      await page.screenshot({ path: outPath, fullPage: false });
      const size = fs.statSync(outPath).size;
      results.ok.push({ slug, size });
      console.log(`[OK]   ${slug} -> ${slug}.png (${size} bytes)`);
    } catch (e) {
      const reason = (e && e.message ? e.message.split('\n')[0] : String(e));
      results.fail.push({ slug, reason });
      console.log(`[FAIL] ${slug} -> ${reason}`);
    } finally {
      if (page) { try { await page.close(); } catch (_) {} }
    }
  }

  await browser.close();

  console.log('\n==== SUMMARY ====');
  console.log(`Captured OK: ${results.ok.length}`);
  for (const r of results.ok) console.log(`  ${r.slug}: ${r.size} bytes`);
  console.log(`Failed: ${results.fail.length}`);
  for (const r of results.fail) console.log(`  ${r.slug}: ${r.reason}`);
})();
