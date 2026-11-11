/**
 * Create section-by-section cropped comparisons between reference and local screenshots.
 * Uses sharp-less approach with canvas.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\kanha\\.gemini\\antigravity\\brain\\890b1024-e565-4f85-a4ad-e83d14175075\\visual_diffs';

// We'll capture both sites section-by-section by scrolling to specific Y offsets
const SECTIONS = [
  { name: '01_hero', scrollY: 0, height: 900 },
  { name: '02_shortcuts_top', scrollY: 800, height: 900 },
  { name: '03_shortcuts_bottom', scrollY: 1600, height: 900 },
  { name: '04_keyboard', scrollY: 2400, height: 1000 },
  { name: '05_extensions', scrollY: 3300, height: 1000 },
  { name: '06_ai_assistant', scrollY: 4200, height: 1000 },
  { name: '07_testimonials', scrollY: 5100, height: 800 },
  { name: '08_snippets', scrollY: 5800, height: 900 },
  { name: '09_feature_grid', scrollY: 6600, height: 1000 },
  { name: '10_community', scrollY: 7500, height: 900 },
  { name: '11_developer', scrollY: 8300, height: 1000 },
  { name: '12_bottom_cta', scrollY: 9200, height: 800 },
  { name: '13_footer', scrollY: 9900, height: 700 },
];

async function captureViewports() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Capture reference sections
  const refPage = await ctx.newPage();
  await refPage.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await refPage.waitForTimeout(3000);

  for (const section of SECTIONS) {
    await refPage.evaluate(y => window.scrollTo(0, y), section.scrollY);
    await refPage.waitForTimeout(500);
    await refPage.screenshot({
      path: path.join(ARTIFACT_DIR, `ref_${section.name}.png`),
      clip: { x: 0, y: 0, width: 1440, height: section.height },
    });
    console.log(`Captured ref_${section.name}`);
  }

  // Capture local sections
  const localPage = await ctx.newPage();
  await localPage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await localPage.waitForTimeout(2000);

  for (const section of SECTIONS) {
    await localPage.evaluate(y => window.scrollTo(0, y), section.scrollY);
    await localPage.waitForTimeout(500);
    await localPage.screenshot({
      path: path.join(ARTIFACT_DIR, `local_${section.name}.png`),
      clip: { x: 0, y: 0, width: 1440, height: section.height },
    });
    console.log(`Captured local_${section.name}`);
  }

  await browser.close();
  console.log('All section screenshots captured.');
}

captureViewports().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
