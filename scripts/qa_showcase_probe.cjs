// Prints the current live structure of the "Take shortcuts" showcase + stylesheet list
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const sc = document.querySelector('[class*=_showcase]');
    const out = { css: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')) };
    if (!sc) { out.none = true; return out; }
    sc.scrollIntoView({ block: 'center' });
    const tree = (e, d) => d > 3 ? '' : '\n' + '  '.repeat(d) + e.tagName + '.' + (e.className.toString().slice(0, 50)) + [...e.attributes].filter((a) => a.name.startsWith('data-')).map((a) => ` ${a.name}=${a.value}`).join('') + ' [' + e.outerHTML.length + ']' + [...e.children].slice(0, 8).map((c) => tree(c, d + 1)).join('');
    out.tree = tree(sc.parentElement.parentElement, 0);
    out.size = sc.outerHTML.length;
    return out;
  });
  console.log(r.css.join('\n')); console.log(r.tree, r.size, r.none);
  await b.close();
})();
