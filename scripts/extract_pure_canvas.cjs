const { chromium } = require('playwright');
const path = require('path');

async function extractPureCanvas() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Set visibility: hidden so layout does NOT collapse!
  await page.evaluate(() => {
    const heroText = document.querySelector('.H3BVAa_heroText');
    if (heroText) heroText.style.visibility = 'hidden';
    const cta = document.querySelector('.EQy08a_container');
    if (cta) cta.style.visibility = 'hidden';
    const ann = document.querySelector('.ezSJPa_announcementContainer');
    if (ann) ann.style.visibility = 'hidden';
    const nav = document.getElementById('navbar');
    if (nav) nav.style.visibility = 'hidden';
  });

  await page.waitForTimeout(500);

  const canvas = await page.$('.H3BVAa_heroBackground canvas');
  if (canvas) {
    await canvas.screenshot({ path: path.join(__dirname, '../public/assets/hero_pure_3d.png') });
    console.log('Successfully captured pure hero 3D background to public/assets/hero_pure_3d.png!');
  }

  await browser.close();
}

extractPureCanvas().catch(console.error);
