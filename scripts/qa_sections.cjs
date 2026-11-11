// Prints top/height of each top-level section of a page (live or local) per viewport.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const url = process.argv[2]; const w=+process.argv[3]||1440, h=+process.argv[4]||900;
  const p = await b.newPage({ viewport:{width:w,height:h} });
  await p.goto(url, { waitUntil:'domcontentloaded', timeout:60000 }); await p.waitForTimeout(3000);
  const r = await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));} window.scrollTo(0,0);await new Promise(r=>setTimeout(r,500));
    let el=document.body; while(true){ const k=[...el.children].filter(c=>c.tagName!=='SCRIPT'&&c.getBoundingClientRect().height>0); if(k.length>=5||k.length===0)break; el=k.sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0]; }
    const kids=[...el.children].filter(c=>c.tagName!=='SCRIPT');
    return {H:document.documentElement.scrollHeight, secs:kids.map(k=>{const r=k.getBoundingClientRect();const hd=k.querySelector('h1,h2,h3');return [k.tagName, Math.round(r.top+scrollY), Math.round(r.height), (hd?hd.textContent:'').slice(0,60)]})}; });
  console.log('H', r.H); r.secs.forEach(s=>console.log(s.join(' | ')));
  await b.close();
})();
