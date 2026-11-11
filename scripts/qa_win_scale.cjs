const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(process.argv[2] || 'https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const e = document.querySelector('[class*=hk6uka_raycastWindowOuter]'); const o = [];
    let x = e;
    for (let i = 0; i < 6 && x; i++) { const c = getComputedStyle(x); o.push(x.className.toString().replace(/[A-Za-z0-9_-]{6}_/g, '').slice(0, 30) + ' st=' + (x.getAttribute('style') || '') + ' w=' + Math.round(x.getBoundingClientRect().width) + ' ow=' + x.offsetWidth + ' tf=' + c.transform + ' zoom=' + c.zoom + ' var=' + c.getPropertyValue('--scale')); x = x.parentElement; }
    return o;
  });
  console.log(r.join('\n'));
  await b.close();
})();
