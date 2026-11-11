const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kanha\\.gemini\\antigravity\\brain\\890b1024-e565-4f85-a4ad-e83d14175075\\visual_diffs';

const SECTIONS = [
  { name: '01_hero', scrollY: 0, height: 900 },
  { name: '02_shortcuts_top', scrollY: 800, height: 900 },
  { name: '03_shortcuts_bottom', scrollY: 1550, height: 900 },
  { name: '04_keyboard', scrollY: 2350, height: 950 },
  { name: '05_extensions', scrollY: 3200, height: 950 },
  { name: '06_ai_assistant', scrollY: 4100, height: 950 },
];

async function captureLocal() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const localPage = await ctx.newPage();
  await localPage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await localPage.waitForTimeout(1500);

  for (const section of SECTIONS) {
    await localPage.evaluate(y => window.scrollTo(0, y), section.scrollY);
    await localPage.waitForTimeout(400);
    await localPage.screenshot({
      path: path.join(ARTIFACT_DIR, `local_${section.name}.png`),
      clip: { x: 0, y: 0, width: 1440, height: section.height },
    });
    console.log(`Updated local_${section.name}.png`);
  }

  await browser.close();
}

captureLocal().catch(console.error);
