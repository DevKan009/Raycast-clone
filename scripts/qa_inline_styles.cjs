// Lists inline styles (JS-set sizing/scale) in given sections at a viewport: node qa_inline_styles.cjs <url> <w> <selector...>
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: +process.argv[3], height: 844 } });
  await p.goto(process.argv[2], { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
  for (const sel of process.argv.slice(4)) {
    const r = await p.evaluate((sel) => { const root = document.querySelector(sel); if (!root) return ['none']; const sec = root.closest('[class*=sectionContainer],[class*=_root]') || root; return [...sec.querySelectorAll('[style]')].filter((e) => /scale|--|zoom|width|height/.test(e.getAttribute('style')) && !/_star|color:transparent/.test(e.className + e.getAttribute('style'))).slice(0, 12).map((e) => e.tagName + '.' + e.className.toString().slice(0, 40) + ' => ' + e.getAttribute('style').slice(0, 160) + ' | w=' + Math.round(e.getBoundingClientRect().width) + ' h=' + Math.round(e.getBoundingClientRect().height)); }, sel);
    console.log('==', sel); console.log(r.join('\n'));
  }
  await b.close();
})();
