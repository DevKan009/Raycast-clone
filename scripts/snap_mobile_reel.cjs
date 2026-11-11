// Splices the <720px image-based showcase reel (captured at 390px) into reference/snap/02.html next to the desktop reel.
const { chromium } = require('playwright'); const fs = require('fs'); const cheerio = require('cheerio');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('https://www.raycast.com/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
  const html = await p.evaluate(() => document.querySelector('[class*=showcaseReel]').outerHTML);
  await b.close();
  const $ = cheerio.load(fs.readFileSync('reference/snap/02.base.html', 'utf8'), null, false);
  const desktop = $('[class*=showcaseReel]').first();
  desktop.addClass('reel-desktop');
  const mob = cheerio.load(html, null, false).root().children().first(); mob.addClass('reel-mobile');
  desktop.after($.html(mob));
  fs.writeFileSync('reference/snap/02.html', $.html());
  console.log('ok', mob.children().length);
})();
