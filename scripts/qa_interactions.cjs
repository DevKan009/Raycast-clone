// Exercises the homepage interactions on the local build and prints observed state: node scripts/qa_interactions.cjs [url] [outDir]
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://localhost:5174/'; const out = process.argv[3] || 'docs/screenshots';
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(url, { waitUntil: 'networkidle' });
  const log = (k, v) => console.log(k.padEnd(28), JSON.stringify(v));
  // Dock
  await p.evaluate(() => document.querySelector('[class*=showcaseReel]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(800);
  const dock = () => p.evaluate(() => { const r = document.querySelector('[class*=showcaseReel]'); return { sl: Math.round(r.scrollLeft), active: [...document.querySelectorAll('[class*=_dock] [class*=_item]')].findIndex((i) => /active/.test(i.className)), tip: document.querySelector('[class*=_tooltip]').textContent }; });
  const items = await p.$$('[class*=_dock] [class*=_item]');
  await items[3].click(); await p.waitForTimeout(1200); log('dock click 3', await dock());
  await items[4].click(); await p.waitForTimeout(1200); log('dock click 4', await dock());
  await p.screenshot({ path: `${out}/interaction_dock.png` });
  await items[0].click(); await p.waitForTimeout(1200); log('dock click 0', await dock());
  // Extensions
  await p.evaluate(() => document.querySelector('[class*=_reelWrapper]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(800);
  const cats = await p.$$('[class*=_category] a');
  const ext = () => p.evaluate(() => ({ vis: [...document.querySelectorAll('[data-cat]')].map((e) => !e.hidden), act: [...document.querySelectorAll('[class*=_category]')].map((c) => /active/.test(c.className) ? c.textContent : '').filter(Boolean)[0], sl: Math.round(document.querySelector('[class*=_reelContainer]').scrollLeft), prevDis: document.querySelector('[class*=_previous]').disabled }));
  await cats[1].click(); await p.waitForTimeout(500); log('ext Engineering', await ext());
  await p.screenshot({ path: `${out}/interaction_ext_engineering.png` });
  await cats[3].click(); await p.waitForTimeout(500); log('ext Writing', await ext());
  await cats[0].click(); await p.waitForTimeout(300);
  await p.click('[class*=_next]'); await p.waitForTimeout(900); log('ext next', await ext());
  await p.click('[class*=_previous]'); await p.waitForTimeout(900); log('ext prev', await ext());
  // Feature wall
  await p.evaluate(() => document.querySelector('[class*=_3QuK8a_container]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(800);
  const fw = () => p.evaluate(() => ({ act: [...document.querySelectorAll('[class*=_3QuK8a_text]')].filter((e) => /active/.test(e.className)).map((e) => e.textContent)[0], img: [...document.querySelectorAll('[class*=_featureImage]')].findIndex((e) => /Active/.test(e.className)), badge: document.querySelector('[class*=_3QuK8a_container] [class*=badge]').textContent, sub: document.querySelector('[class*=_featureSubtitle]').textContent.slice(0, 40) }));
  log('feature init', await fw());
  await p.waitForTimeout(5400); log('feature +5s', await fw());
  const texts = await p.$$('[class*=_3QuK8a_text][role=button]'); await texts[5].click(); await p.waitForTimeout(500); log('feature click 5', await fw());
  await p.screenshot({ path: `${out}/interaction_features.png` });
  // Mobile nav + hero
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(url, { waitUntil: 'networkidle' });
  await m.click('.nav-toggle'); await m.waitForTimeout(600); await m.screenshot({ path: `${out}/interaction_mobile_menu.png` });
  log('mobile menu open', await m.evaluate(() => ({ open: document.querySelector('.navbar').classList.contains('open'), links: document.querySelectorAll('.nav-links a').length })));
  await m.click('.nav-toggle'); await m.waitForTimeout(400);
  log('mobile overflow', await m.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
  log('errors', errors.slice(0, 5));
  await b.close();
})();
