const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'reference');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to https://www.raycast.com/ ...');
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle2', timeout: 60000 });

  // Scroll down smoothly to trigger lazy-loaded sections and animations
  console.log('Scrolling down to trigger lazy loading...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });

  // Wait 3 seconds for animations and elements to settle
  await new Promise(r => setTimeout(r, 3000));

  console.log('Capturing desktop full page screenshot (1440x900)...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'raycast_desktop_full_1440.png'),
    fullPage: true
  });

  console.log('Capturing desktop viewport screenshot (1440x900)...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'raycast_desktop_above_fold.png'),
    fullPage: false
  });

  // Extract page metadata, sections, typography, colors, assets
  console.log('Extracting page structure and assets...');
  const pageData = await page.evaluate(() => {
    // Collect all colors and computed styles from key tags
    const stylesInfo = {};
    const bodyStyle = window.getComputedStyle(document.body);
    stylesInfo.bodyBg = bodyStyle.backgroundColor;
    stylesInfo.bodyColor = bodyStyle.color;
    stylesInfo.fontFamily = bodyStyle.fontFamily;

    // Discover all top-level main/header/footer/section tags
    const sections = [];
    const mainEl = document.querySelector('main') || document.body;
    
    // Check navigation
    const nav = document.querySelector('nav') || document.querySelector('header');
    
    // All direct children or sections of main
    const elements = Array.from(document.querySelectorAll('header, nav, main > *, footer, section'));
    
    // Collect detailed info for each major block
    const allImages = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      className: img.className
    }));

    const allVideos = Array.from(document.querySelectorAll('video')).map(v => ({
      src: v.src || (v.querySelector('source') ? v.querySelector('source').src : ''),
      poster: v.poster,
      autoplay: v.autoplay,
      loop: v.loop,
      muted: v.muted,
      className: v.className
    }));

    const allSvgs = Array.from(document.querySelectorAll('svg')).map((svg, i) => ({
      index: i,
      viewBox: svg.getAttribute('viewBox'),
      width: svg.getAttribute('width') || svg.clientWidth,
      height: svg.getAttribute('height') || svg.clientHeight,
      className: svg.className ? svg.className.toString() : '',
      outerHTML: svg.outerHTML.length < 5000 ? svg.outerHTML : svg.outerHTML.slice(0, 500) + '...'
    }));

    // Find all headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      fontSize: window.getComputedStyle(h).fontSize,
      fontWeight: window.getComputedStyle(h).fontWeight,
      lineHeight: window.getComputedStyle(h).lineHeight,
      letterSpacing: window.getComputedStyle(h).letterSpacing,
      color: window.getComputedStyle(h).color
    }));

    // Find buttons and links
    const buttons = Array.from(document.querySelectorAll('button, a[href]')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim(),
      href: b.getAttribute('href'),
      className: b.className ? b.className.toString() : '',
      bg: window.getComputedStyle(b).backgroundColor,
      color: window.getComputedStyle(b).color,
      borderRadius: window.getComputedStyle(b).borderRadius
    })).filter(b => b.text.length > 0 && b.text.length < 100);

    return {
      title: document.title,
      stylesInfo,
      headings,
      buttons: buttons.slice(0, 100),
      images: allImages,
      videos: allVideos,
      svgCount: allSvgs.length,
      sampleSvgs: allSvgs.slice(0, 30)
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'page_data.json'), JSON.stringify(pageData, null, 2));

  // Dump the complete HTML
  const fullHtml = await page.content();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'page.html'), fullHtml);

  // Now capture mobile viewport (390x844)
  console.log('Capturing mobile full page screenshot (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'raycast_mobile_full_390.png'),
    fullPage: true
  });

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'raycast_mobile_above_fold.png'),
    fullPage: false
  });

  // Tablet viewport (768x1024)
  console.log('Capturing tablet full page screenshot (768x1024)...');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'raycast_tablet_full_768.png'),
    fullPage: true
  });

  await browser.close();
  console.log('Inspection complete! Output saved to', OUTPUT_DIR);
}

run().catch(err => {
  console.error('Error during inspection:', err);
  process.exit(1);
});
