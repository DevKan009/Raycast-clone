const { chromium } = require('playwright');

async function findCanvases() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  const canvases = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).map((c, i) => {
      const rect = c.getBoundingClientRect();
      return {
        index: i,
        width: c.width,
        height: c.height,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        classes: c.className,
        parentClass: c.parentElement ? c.parentElement.className : '',
      };
    });
  });

  console.log('Canvases found:', JSON.stringify(canvases, null, 2));

  // Also check if the background is an image or video or WebGL
  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('div[class*="hero"]');
    if (!hero) return null;
    const styles = window.getComputedStyle(hero);
    return {
      classes: hero.className,
      rect: hero.getBoundingClientRect(),
      bg: styles.backgroundImage,
      bgColor: styles.backgroundColor,
      children: Array.from(hero.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        rect: c.getBoundingClientRect(),
        bg: window.getComputedStyle(c).backgroundImage
      }))
    };
  });

  console.log('Hero info:', JSON.stringify(heroInfo, null, 2));

  await browser.close();
}

findCanvases().catch(console.error);
