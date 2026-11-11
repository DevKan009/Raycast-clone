// Prints console/page errors of the local page: node scripts/qa_errors.cjs [url]
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 400)));
  p.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE ' + m.text().slice(0, 400)));
  await p.goto(process.argv[2] || 'http://localhost:5174/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  console.log(errs.slice(0, 6).join('\n') || 'no errors', '| height', await p.evaluate(() => document.documentElement.scrollHeight));
  await b.close();
})();
