const { chromium } = require('playwright');
const path = require('path');

async function extractCanvas() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  const canvas = await page.$('.H3BVAa_heroBackground canvas');
  if (canvas) {
    await canvas.screenshot({ path: path.join(__dirname, '../public/assets/hero_3d_canvas.png') });
    console.log('Successfully captured hero 3D canvas snapshot to public/assets/hero_3d_canvas.png!');
  } else {
    console.log('Canvas not found');
  }

  await browser.close();
}

extractCanvas().catch(console.error);
