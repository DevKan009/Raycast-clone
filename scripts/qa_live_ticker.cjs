const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelector('[class*=ticker]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1000);
  const g = () => p.evaluate(() => { const c = document.querySelector('[class*=embla] > [class*=container]'); const sl = [...c.children]; return { t: c.style.transform, n: sl.length, w: sl[0].getBoundingClientRect().width, x0: sl[0].getBoundingClientRect().x, gap: sl[1].getBoundingClientRect().x - sl[0].getBoundingClientRect().right, ts: performance.now() }; });
  const a = await g(); await p.waitForTimeout(2000); const b2 = await g();
  console.log(JSON.stringify(a), JSON.stringify(b2));
  await p.hover('[class*=embla]'); await p.waitForTimeout(300); const h1 = await g(); await p.waitForTimeout(1500); const h2 = await g(); console.log('hover', h1.t, h2.t);
  await b.close();
})();
