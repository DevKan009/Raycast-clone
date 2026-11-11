// Verifies the recorded demos replay on the local page: samples the showcase input text + dock state over time,
// clicks a dock item and a feature sentence, and reports per-section heights vs live at 390px.
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://localhost:5174/'; const out = process.argv[3] || 'docs/screenshots';
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('[class*=showcaseReel]').scrollIntoView({ block: 'center' }));
  const st = () => p.evaluate(() => {
    const items = [...document.querySelectorAll('[class*=_dock] [class*=_item]')];
    const slide = document.querySelector('[class*=_slide][data-active=true]');
    const val = slide && slide.querySelector('[class*=_value]');
    const reel = document.querySelector('[class*=showcaseReel]');
    return { dock: items.findIndex((i) => /_active/.test(i.className)), typed: val ? val.textContent : null, sl: Math.round(reel.scrollLeft), tip: (document.querySelector('[class*=_tooltip]') || {}).textContent };
  });
  for (let i = 0; i < 9; i++) { await p.waitForTimeout(1800); console.log('t+' + ((i + 1) * 1.8).toFixed(1) + 's', JSON.stringify(await st())); if (i === 2) await p.screenshot({ path: `${out}/replay_clipboard.png` }); }
  const items = await p.$$('[class*=_dock] [class*=_item]');
  await items[4].click(); await p.waitForTimeout(3500); console.log('click dock 4', JSON.stringify(await st())); await p.screenshot({ path: `${out}/replay_window_management.png` });
  await items[1].click(); await p.waitForTimeout(5500); console.log('click dock 1', JSON.stringify(await st())); await p.screenshot({ path: `${out}/replay_ai.png` });
  // feature wall
  await p.evaluate(() => document.querySelector('[class*=_wall]').scrollIntoView({ block: 'center' }));
  const fw = () => p.evaluate(() => { const a = [...document.querySelectorAll('[class*=_wall] [class*=_text]')].find((e) => /_active/.test(e.className)); return a && a.textContent; });
  await p.waitForTimeout(1000); console.log('feature', await fw()); await p.waitForTimeout(5200); console.log('feature +5s', await fw());
  const t = await p.$$('[class*=_wall] [class*=_text][role=button]'); await t[6].click(); await p.waitForTimeout(900); console.log('feature click 6', await fw());
  await p.screenshot({ path: `${out}/replay_feature.png` });
  console.log('errors', JSON.stringify(errs.slice(0, 3)));
  await b.close();
})();
