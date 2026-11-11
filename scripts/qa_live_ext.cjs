// Explores extensions carousel behaviour on live site
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  await p.evaluate(() => document.querySelector('[class*=_reelWrapper]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  const st = () => p.evaluate(() => {
    const rw = document.querySelector('[class*=_reelWrapper]'); const rc = document.querySelector('[class*=_reelContainer]'); const reel = document.querySelector('[class*=_reel]:not([class*=Wrapper]):not([class*=Container])');
    const cats = [...document.querySelectorAll('[class*=_category]:not([class*=Container]):not([class*=categories])')];
    const act = document.querySelector('[class*=activeBackdrop]');
    return { rwSL: rw.scrollLeft, rcSL: rc.scrollLeft, rcSW: rc.scrollWidth, rcCW: rc.clientWidth, reelT: reel && reel.style.transform, reelCls: reel && reel.className, nCards: reel && reel.children.length,
      cats: cats.map((c) => c.textContent + (/active/.test(c.className) ? '*' : '')).join(','), act: act && act.getAttribute('style'), cardTitles: reel && [...reel.children].map((c) => c.textContent.slice(0, 18)).join('|') };
  });
  console.log('init', JSON.stringify(await st()));
  const cats = await p.$$('[class*=_category]:not([class*=Container]):not([class*=categories])');
  await cats[1].click(); await p.waitForTimeout(1500); console.log('eng', JSON.stringify(await st()));
  await cats[3].click(); await p.waitForTimeout(1500); console.log('writing', JSON.stringify(await st()));
  await cats[0].click(); await p.waitForTimeout(1500);
  await p.click('[class*=_next]'); await p.waitForTimeout(1200); console.log('next', JSON.stringify(await st()));
  await p.click('[class*=_next]'); await p.waitForTimeout(1200); console.log('next2', JSON.stringify(await st()));
  await p.click('[class*=_previous]'); await p.waitForTimeout(1200); console.log('prev', JSON.stringify(await st()));
  await b.close();
})();
