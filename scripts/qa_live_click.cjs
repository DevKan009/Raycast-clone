// Explores dock/reel behaviour on the live site: node scripts/qa_live_click.cjs
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  await p.evaluate(() => document.querySelector('[class*=showcaseReel]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  const st = () => p.evaluate(() => {
    const r = document.querySelector('[class*=showcaseReel]');
    const items = [...document.querySelectorAll('[class*=dock] [class*=item]')];
    const tip = document.querySelector('[class*=tooltip]');
    return { sl: r.scrollLeft, sw: r.scrollWidth, cw: r.clientWidth, snap: getComputedStyle(r).scrollSnapType, beh: getComputedStyle(r).scrollBehavior, ov: getComputedStyle(r).overflow, active: items.findIndex((i) => /active/.test(i.className)), tip: tip && tip.textContent, tipT: tip && tip.style.transform };
  });
  console.log('init', JSON.stringify(await st()));
  const items = await p.$$('[class*=dock] [class*=item]');
  for (const i of [2, 4, 1]) { await items[i].click(); await p.waitForTimeout(1200); console.log('click', i, JSON.stringify(await st())); }
  await items[3].hover(); await p.waitForTimeout(500); console.log('hover3', JSON.stringify(await st()));
  await p.waitForTimeout(8000); console.log('after8s', JSON.stringify(await st()));
  await p.evaluate(() => { document.querySelector('[class*=showcaseReel]').scrollLeft = 1184 * 3; });
  await p.waitForTimeout(800); console.log('manual scroll', JSON.stringify(await st()));
  await b.close();
})();
