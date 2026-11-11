// Records DOM mutations over time for each section on the live site (reveals JS-driven animations)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  const heads = [3, 5, 6, 7, 8, 9, 10, 11].map(String);
  const nSec = await p.evaluate(() => { let el = document.body; while (true) { const k = [...el.children].filter((c) => c.tagName !== 'SCRIPT' && c.getBoundingClientRect().height > 0); if (k.length >= 5 || !k.length) break; el = k.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0]; } window.__secs = [...el.children].filter((c) => c.tagName !== 'SCRIPT' && c.getBoundingClientRect().height > 0); return window.__secs.length; });
  for (const i of [3, 4, 5, 6, 7, 8, 9, 10, 11]) {
    await p.evaluate((i) => { const s = window.__secs[i]; window.scrollTo(0, s.getBoundingClientRect().top + scrollY + Math.min(200, s.getBoundingClientRect().height / 3)); }, i);
    await p.waitForTimeout(1500);
    const rec = await p.evaluate(async (i) => {
      const s = window.__secs[i]; const counts = {}; const ex = {};
      const mo = new MutationObserver((ms) => ms.forEach((m) => { const t = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (!t) return; const key = (t.className && t.className.toString().replace(/[A-Za-z0-9_-]{6}_/g, '').split(' ')[0].slice(0, 30)) + '|' + m.type + (m.attributeName ? ':' + m.attributeName : ''); counts[key] = (counts[key] || 0) + 1; if (!ex[key]) ex[key] = (m.type === 'attributes' ? (t.getAttribute(m.attributeName) || '').slice(0, 80) : (m.target.textContent || '').slice(0, 60)); }));
      mo.observe(s, { subtree: true, attributes: true, childList: true, characterData: true });
      await new Promise((r) => setTimeout(r, 9000)); mo.disconnect();
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => k + ' x' + v + '  e.g. ' + ex[k]);
    }, i);
    console.log('--- section', i); rec.forEach((r) => console.log('  ', r));
  }
  await b.close();
})();
