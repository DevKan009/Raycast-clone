// Explores features rotator (section 8) + community slider (section 9) on the live site
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelector('[class*=_3QuK8a_container]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1200);
  const st = () => p.evaluate(() => ({
    act: [...document.querySelectorAll('[class*=_3QuK8a_text]')].map((e) => /active/.test(e.className) ? e.textContent : '').filter(Boolean).join(),
    img: [...document.querySelectorAll('[class*=featureImage]')].findIndex((e) => /Active/.test(e.className)),
    page: [...document.querySelectorAll('[class*=_3QuK8a_page]')].map((e) => (/current/.test(e.className) ? '*' : '.') + (e.getAttribute('style') || '')).join(' '),
  }));
  console.log('init', JSON.stringify(await st()));
  await p.waitForTimeout(5500); console.log('+5.5s', JSON.stringify(await st()));
  await p.waitForTimeout(5000); console.log('+10.5s', JSON.stringify(await st()));
  const texts = await p.$$('[class*=_3QuK8a_text]');
  console.log('n texts', texts.length);
  await texts[4].click({ force: true }); await p.waitForTimeout(800); console.log('click text4', JSON.stringify(await st()));
  const pages = await p.$$('[class*=_3QuK8a_page]');
  await pages[1].click({ force: true }); await p.waitForTimeout(800); console.log('click page1', JSON.stringify(await st()));
  await p.screenshot({ path: process.argv[2] + '/feat_live.png' });
  // community
  await p.evaluate(() => document.querySelector('[class*=slide]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1000);
  const c = () => p.evaluate(() => { const s = document.querySelector('[class*=slide]'); return { cls: s.className, style: s.getAttribute('style'), kids: s.children.length, parent: s.parentElement.className, cstyle: s.querySelector('[class*=container]') && s.querySelector('[class*=container]').getAttribute('style') }; });
  console.log('community', JSON.stringify(await c())); await p.waitForTimeout(1500); console.log('community+1.5', JSON.stringify(await c()));
  await b.close();
})();
