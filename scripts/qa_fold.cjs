const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('https://www.raycast.com/',{waitUntil:'domcontentloaded'});
for(const t of [2000,6000]){await p.waitForTimeout(t);await p.screenshot({path:process.argv[2]+`/ref_fold_${t}.png`});}
await b.close();})();
