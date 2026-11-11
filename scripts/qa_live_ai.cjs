// What happens when AI-section buttons / snippets inputs are clicked on the live site?
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => { window.__log = []; new MutationObserver((ms) => ms.forEach((m) => { const t = m.target.nodeType === 1 ? m.target : m.target.parentElement; window.__log.push((t && t.className && t.className.toString().replace(/[A-Za-z0-9_-]{6}_/g, '').slice(0, 40)) + '|' + m.type + (m.attributeName ? ':' + m.attributeName : '') + '|' + (m.type === 'attributes' ? (t.getAttribute(m.attributeName) || '').slice(0, 60) : (m.addedNodes.length + '+' + m.removedNodes.length))); })).observe(document.body, { subtree: true, attributes: true, childList: true, characterData: true }); });
  const tryClick = async (sel, idx, label) => {
    const els = await p.$$(sel); if (!els[idx]) { console.log(label, 'none'); return; }
    await els[idx].scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    await p.evaluate(() => { window.__log.length = 0; });
    await els[idx].click({ force: true }); await p.waitForTimeout(1500);
    const l = await p.evaluate(() => window.__log.slice(0, 8)); console.log(label, JSON.stringify(l));
  };
  await tryClick('[class*=V1XIQW_item]', 2, 'sidebar item');
  await tryClick('[class*=RhnfLq_header]', 0, 'sidebar header');
  await tryClick('[class*=OvGovq_sendButton]', 0, 'send');
  await tryClick('[class*=OvGovq_emojiPicker]', 0, 'emoji');
  await tryClick('[class*=D6--Sa_input]', 0, 'search input');
  await tryClick('[class*=oMomFq_input]', 0, 'footer input');
  const btn = await p.$$eval('button', (bs) => bs.map((x) => x.className.replace(/[A-Za-z0-9_-]{6}_/g, '') + ':' + x.textContent.slice(0, 15)));
  console.log(btn.join(' || '));
  await b.close();
})();
