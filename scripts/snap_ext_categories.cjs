// Adds the Engineering/Design/Writing card sets (clicked live) into reference/snap/04.html as hidden sibling blocks.
const { chromium } = require('playwright'); const fs = require('fs'); const cheerio = require('cheerio');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelector('[class*=_reelWrapper]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  const cats = await p.$$('[class*=_category]:not([class*=Container]):not([class*=categories]) a');
  const sets = [];
  for (let i = 0; i < cats.length; i++) {
    await cats[i].click(); await p.waitForTimeout(2500);
    sets.push(await p.evaluate(() => { const e = document.querySelector('[class*=_3Yq4tG_padding]').cloneNode(true); e.querySelectorAll('script').forEach((s) => s.remove()); return e.outerHTML; }));
  }
  const $ = cheerio.load(fs.readFileSync('reference/snap/04.base.html', 'utf8'), null, false);
  const pad = $('[class*=_3Yq4tG_padding]').first();
  pad.attr('data-cat', '0');
  for (let i = 1; i < sets.length; i++) { const el = cheerio.load(sets[i], null, false).root().children().first(); el.attr('data-cat', String(i)); el.attr('hidden', ''); pad.parent().append($.html(el)); }
  fs.writeFileSync('reference/snap/04.html', $.html());
  console.log('categories', sets.length, sets.map((s) => (s.match(/extensionCardWrapper/g) || []).length));
  await b.close();
})();
