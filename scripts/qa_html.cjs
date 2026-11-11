// node qa_html.cjs <url> <w> <h> <jsExprReturningElement> : prints cleaned outerHTML
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:+process.argv[3],height:+process.argv[4]}});await p.goto(process.argv[2],{waitUntil:'domcontentloaded'});await p.waitForTimeout(3500);
const r=await p.evaluate(`(()=>{const e=(${process.argv[5]}).cloneNode(true);e.querySelectorAll('svg').forEach(s=>s.innerHTML='');e.querySelectorAll('script,style,canvas').forEach(s=>s.remove());let h=e.outerHTML;return h.replace(/ (data-[a-z-]+|style|srcset|sizes|loading|decoding|fetchpriority)="[^"]*"/g,'').replace(/ class="([^"]*)"/g,(m,c)=>' class="'+c.replace(/[A-Za-z0-9_-]{6}_/g,'')+'"')})()`);
console.log(r.slice(0,+process.argv[6]||6000));await b.close();})();
