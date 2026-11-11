// Captures local full-page + viewport screenshots at the 4 target sizes.
const { chromium } = require('playwright');
const SIZES = { desktop:[1440,900], large:[1920,1080], tablet:[768,1024], mobile:[390,844] };
(async () => {
  const b = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const url = process.argv[2] || 'http://localhost:5174/';
  const out = process.argv[3] || 'docs/screenshots';
  for (const [n,[w,h]] of Object.entries(SIZES)) {
    const p = await b.newPage({ viewport:{width:w,height:h} });
    await p.goto(url, { waitUntil:'networkidle' });
    await p.screenshot({ path:`${out}/${n}_fold.png` });
    const H = await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));} window.scrollTo(0,0); await new Promise(r=>setTimeout(r,500)); return [document.documentElement.scrollHeight, document.documentElement.scrollWidth]; });
    await p.screenshot({ path:`${out}/${n}_full.png`, fullPage:true });
    console.log(n, 'height', H[0], 'scrollWidth', H[1], 'vw', w);
    await p.close();
  }
  await b.close();
})();
