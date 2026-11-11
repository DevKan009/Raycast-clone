const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\kanha\\.gemini\\antigravity\\brain\\890b1024-e565-4f85-a4ad-e83d14175075';
const DIFFS_DIR = path.join(ARTIFACT_DIR, 'visual_diffs');

if (!fs.existsSync(DIFFS_DIR)) {
  fs.mkdirSync(DIFFS_DIR, { recursive: true });
}

// Helper to create a side-by-side image of imageA and imageB
function createSideBySide(pngA, pngB, outputPath) {
  const width = pngA.width + pngB.width;
  const height = Math.max(pngA.height, pngB.height);
  const composite = new PNG({ width, height });

  // Fill black
  for (let i = 0; i < composite.data.length; i += 4) {
    composite.data[i] = 7;
    composite.data[i + 1] = 8;
    composite.data[i + 2] = 10;
    composite.data[i + 3] = 255;
  }

  // Copy pngA to left
  for (let y = 0; y < pngA.height; y++) {
    for (let x = 0; x < pngA.width; x++) {
      const srcIdx = (y * pngA.width + x) * 4;
      const dstIdx = (y * width + x) * 4;
      composite.data[dstIdx] = pngA.data[srcIdx];
      composite.data[dstIdx + 1] = pngA.data[srcIdx + 1];
      composite.data[dstIdx + 2] = pngA.data[srcIdx + 2];
      composite.data[dstIdx + 3] = pngA.data[srcIdx + 3];
    }
  }

  // Copy pngB to right
  for (let y = 0; y < pngB.height; y++) {
    for (let x = 0; x < pngB.width; x++) {
      const srcIdx = (y * pngB.width + x) * 4;
      const dstIdx = (y * width + (x + pngA.width)) * 4;
      composite.data[dstIdx] = pngB.data[srcIdx];
      composite.data[dstIdx + 1] = pngB.data[srcIdx + 1];
      composite.data[dstIdx + 2] = pngB.data[srcIdx + 2];
      composite.data[dstIdx + 3] = pngB.data[srcIdx + 3];
    }
  }

  fs.writeFileSync(outputPath, PNG.sync.write(composite));
}

async function run() {
  console.log('Launching Chrome via Playwright...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1, // standard 1x for direct pixel alignment
  });

  const pageOfficial = await context.newPage();
  const pageLocal = await context.newPage();

  console.log('Loading official https://www.raycast.com/ ...');
  await pageOfficial.goto('https://www.raycast.com/', { waitUntil: 'networkidle', timeout: 60000 });
  // Scroll through official to trigger lazy-loaded assets
  await pageOfficial.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 500) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await pageOfficial.waitForTimeout(2000);

  console.log('Loading local http://localhost:5173/ ...');
  await pageLocal.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await pageLocal.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 500) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await pageLocal.waitForTimeout(2000);

  // Sections to inspect and compare:
  // 1. Above the fold (Hero + Nav)
  // 2. Shortcuts showcase ("Take shortcuts, not detours")
  // 3. Mechanical Keyboard showcase
  // 4. Extensions showcase
  // 5. Raycast AI showcase
  // 6. Testimonials
  // 7. Snippets & Quicklinks
  // 8. Feature Grid ("What else can Raycast do?")
  // 9. Community ("Stay in the loop")
  // 10. Developer Section ("Build the perfect tools")
  // 11. Footer

  console.log('Capturing section comparisons...');

  // 1. Navbar & Hero (viewport 0, 0, 1440, 900)
  await pageOfficial.evaluate(() => window.scrollTo(0, 0));
  await pageLocal.evaluate(() => window.scrollTo(0, 0));
  const offHeroBuf = await pageOfficial.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  const locHeroBuf = await pageLocal.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  createSideBySide(PNG.sync.read(offHeroBuf), PNG.sync.read(locHeroBuf), path.join(DIFFS_DIR, '01_hero_comparison.png'));
  console.log('Saved 01_hero_comparison.png');

  // Let's get actual section bounding boxes from both pages
  const officialSections = await pageOfficial.evaluate(() => {
    const list = [];
    const children = Array.from(document.querySelector('#root').children);
    children.forEach((c, idx) => {
      const h = c.querySelector('h1, h2, h3, h4, h5');
      const rect = c.getBoundingClientRect();
      list.push({
        idx,
        heading: h ? h.innerText.replace(/\n/g, ' ') : '',
        top: rect.top + window.scrollY,
        height: rect.height,
      });
    });
    return list;
  });

  const localSections = await pageLocal.evaluate(() => {
    const list = [];
    const main = document.querySelector('main');
    const sections = Array.from(main.children);
    sections.forEach((c, idx) => {
      const h = c.querySelector('h1, h2, h3, h4, h5');
      const rect = c.getBoundingClientRect();
      list.push({
        idx,
        heading: h ? h.innerText.replace(/\n/g, ' ') : '',
        top: rect.top + window.scrollY,
        height: rect.height,
      });
    });
    return list;
  });

  console.log('Official sections detected:', officialSections.length);
  console.log('Local sections detected:', localSections.length);

  // Compare each matching section
  const sectionPairs = [
    { name: '02_shortcuts', offScroll: 1050, locScroll: 900, height: 900 },
    { name: '03_keyboard', offScroll: 2500, locScroll: 1900, height: 800 },
    { name: '04_extensions', offScroll: 3250, locScroll: 2750, height: 900 },
    { name: '05_ai', offScroll: 4600, locScroll: 3900, height: 900 },
    { name: '06_testimonials', offScroll: 6150, locScroll: 4900, height: 850 },
    { name: '07_snippets', offScroll: 7300, locScroll: 5800, height: 850 },
    { name: '08_feature_grid', offScroll: 8450, locScroll: 6800, height: 900 },
    { name: '09_community', offScroll: 9450, locScroll: 7900, height: 800 },
    { name: '10_developer', offScroll: 10300, locScroll: 8800, height: 900 },
    { name: '11_bottom_cta', offScroll: 13450, locScroll: 10000, height: 800 },
    { name: '12_footer', offScroll: 14700, locScroll: 10800, height: 900 },
  ];

  for (const pair of sectionPairs) {
    await pageOfficial.evaluate((y) => window.scrollTo(0, y), pair.offScroll);
    await pageLocal.evaluate((y) => window.scrollTo(0, y), pair.locScroll);
    await pageOfficial.waitForTimeout(300);
    await pageLocal.waitForTimeout(300);

    const offBuf = await pageOfficial.screenshot({ clip: { x: 0, y: 0, width: 1440, height: pair.height } });
    const locBuf = await pageLocal.screenshot({ clip: { x: 0, y: 0, width: 1440, height: pair.height } });

    createSideBySide(PNG.sync.read(offBuf), PNG.sync.read(locBuf), path.join(DIFFS_DIR, `${pair.name}_comparison.png`));
    console.log(`Saved ${pair.name}_comparison.png`);
  }

  await browser.close();
  console.log('All visual comparison images generated in:', DIFFS_DIR);
}

run().catch(err => {
  console.error('Comparison error:', err);
  process.exit(1);
});
