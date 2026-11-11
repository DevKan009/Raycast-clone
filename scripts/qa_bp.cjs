const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const w of [400, 480, 560, 640, 700, 720, 768, 800]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
    console.log(w, await p.evaluate(() => { const r = document.querySelector('[class*=showcaseReel]'); return r ? (r.firstElementChild.firstElementChild.tagName === 'IMG' ? 'IMG' : 'DOM') : 'none'; }));
    await p.close();
  }
  await b.close();
})();
