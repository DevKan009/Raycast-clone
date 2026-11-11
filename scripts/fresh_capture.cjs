/**
 * Capture fresh full-page screenshots of both the live Raycast site
 * and the local clone for visual comparison.
 */
const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kanha\\.gemini\\antigravity\\brain\\890b1024-e565-4f85-a4ad-e83d14175075\\visual_diffs';

async function capture() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  // Desktop viewport
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  // Capture live site - desktop
  console.log('Capturing live site at 1440x900...');
  const livePage = await desktopCtx.newPage();
  await livePage.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await livePage.waitForTimeout(3000); // Let animations settle
  await livePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'ref_desktop_full.png'),
    fullPage: true,
  });
  console.log('Live desktop captured.');

  // Capture local site - desktop
  console.log('Capturing local site at 1440x900...');
  const localPage = await desktopCtx.newPage();
  await localPage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await localPage.waitForTimeout(2000);
  await localPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'local_desktop_full.png'),
    fullPage: true,
  });
  console.log('Local desktop captured.');

  // Mobile viewport
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });

  // Capture live site - mobile
  console.log('Capturing live site at 390x844...');
  const liveMobile = await mobileCtx.newPage();
  await liveMobile.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await liveMobile.waitForTimeout(3000);
  await liveMobile.screenshot({
    path: path.join(ARTIFACT_DIR, 'ref_mobile_full.png'),
    fullPage: true,
  });
  console.log('Live mobile captured.');

  // Capture local site - mobile
  console.log('Capturing local site at 390x844...');
  const localMobile = await mobileCtx.newPage();
  await localMobile.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await localMobile.waitForTimeout(2000);
  await localMobile.screenshot({
    path: path.join(ARTIFACT_DIR, 'local_mobile_full.png'),
    fullPage: true,
  });
  console.log('Local mobile captured.');

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
