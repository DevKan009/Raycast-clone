const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function measure() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.raycast.com/', { waitUntil: 'networkidle2' });

  const sectionRects = await page.evaluate(() => {
    const root = document.querySelector('#root');
    const children = Array.from(root.children);
    return children.map((c, i) => {
      const rect = c.getBoundingClientRect();
      const h = c.querySelector('h1, h2, h3, h4, h5');
      return {
        index: i,
        id: c.id,
        className: c.className.slice(0, 30),
        heading: h ? h.innerText.replace(/\n/g, ' ') : '',
        width: rect.width,
        height: rect.height,
        top: rect.top + window.scrollY,
      };
    });
  });

  console.log('Raycast Live Section Dimensions (1440px desktop):');
  console.table(sectionRects);

  await browser.close();
}

measure();
