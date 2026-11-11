const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOCAL_OUT = path.join(__dirname, '..', 'reference', 'local');

if (!fs.existsSync(LOCAL_OUT)) {
  fs.mkdirSync(LOCAL_OUT, { recursive: true });
}

async function capture() {
  console.log('Launching Chrome for local verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  
  // Listen for console errors or network failures
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('Browser console error:', msg.text());
  });
  page.on('pageerror', err => {
    console.error('Page uncaught error:', err.message);
  });

  // Desktop 1440x900
  console.log('Capturing Desktop 1440x900...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(LOCAL_OUT, 'desktop_above_fold_1440.png'),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(LOCAL_OUT, 'desktop_full_1440.png'),
    fullPage: true
  });

  // Tablet 768x1024
  console.log('Capturing Tablet 768x1024...');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(LOCAL_OUT, 'tablet_full_768.png'),
    fullPage: true
  });

  // Mobile 390x844
  console.log('Capturing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(LOCAL_OUT, 'mobile_above_fold_390.png'),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(LOCAL_OUT, 'mobile_full_390.png'),
    fullPage: true
  });

  // Check for any horizontal overflow
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected:', overflow);

  await browser.close();
  console.log('Capture finished successfully!');
}

capture().catch(err => {
  console.error('Error in capture:', err);
  process.exit(1);
});
