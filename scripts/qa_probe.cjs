// node qa_probe.cjs <url> <w> <h> <selectorJS-returning-array-of-elements>
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:+process.argv[3],height:+process.argv[4]}});await p.goto(process.argv[2],{waitUntil:'domcontentloaded'});await p.waitForTimeout(3500);
const r=await p.evaluate(`(()=>{const els=(${process.argv[5]});const P=['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderRadius','border','boxShadow','padding','margin','display','gap','maxWidth','textAlign'];
return els.map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);const o={tag:e.tagName,cls:(e.className||'').toString().slice(0,60),txt:(e.textContent||'').trim().slice(0,40),x:Math.round(r.x),y:Math.round(r.y+scrollY),w:Math.round(r.width),h:Math.round(r.height)};P.forEach(k=>{const v=c[k];if(v&&!['none','normal','0px','rgba(0, 0, 0, 0)','0px none rgb(255, 255, 255)'].includes(v))o[k]=v});return o})})()`);
console.log(r.map(x=>JSON.stringify(x)).join('\n'));await b.close();})();
