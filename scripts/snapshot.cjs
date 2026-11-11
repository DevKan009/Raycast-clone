// Snapshots each top-level homepage section's rendered DOM (after scrolling to trigger reveals) to reference/snap/NN.html
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto('https://www.raycast.com/', { waitUntil:'domcontentloaded', timeout:60000 }); await p.waitForTimeout(3000);
  await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=250){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,250));} await new Promise(r=>setTimeout(r,1500)); window.scrollTo(0,0); });
  await p.waitForTimeout(1500);
  const secs = await p.evaluate(()=>{
    let el=document.body; while(true){ const k=[...el.children].filter(c=>c.tagName!=='SCRIPT'&&c.getBoundingClientRect().height>0); if(k.length>=5||k.length===0)break; el=k.sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0]; }
    return [...el.children].filter(c=>c.tagName!=='SCRIPT'&&c.getBoundingClientRect().height>0).map(c=>{
      const e=c.cloneNode(true); e.querySelectorAll('script').forEach(s=>s.remove());
      return { cls:c.className, html:e.outerHTML };
    });
  });
  secs.forEach((s,i)=>fs.writeFileSync(`reference/snap/${String(i).padStart(2,'0')}.html`, s.html));
  console.log(secs.map((s,i)=>i+' '+s.cls.slice(0,40)+' '+s.html.length).join('\n'));
  await b.close();
})();
