// Screenshot each top-level section: node qa_slices.cjs <url> <w> <h> <outDir>
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const [url,w,h,out]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]]; fs.mkdirSync(out,{recursive:true});
  const p = await b.newPage({ viewport:{width:w,height:h} });
  await p.goto(url, { waitUntil:'domcontentloaded', timeout:60000 }); await p.waitForTimeout(3000);
  const boxes = await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));} window.scrollTo(0,0);await new Promise(r=>setTimeout(r,500));
    let el=document.body; while(true){ const k=[...el.children].filter(c=>c.tagName!=='SCRIPT'&&c.getBoundingClientRect().height>0); if(k.length>=5||k.length===0)break; el=k.sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0]; }
    return [...el.children].filter(c=>c.tagName!=='SCRIPT').map(k=>{const r=k.getBoundingClientRect();return {y:r.top+scrollY,h:r.height}}).filter(b=>b.h>0);});
  let i=0; for(const bx of boxes){ await p.screenshot({path:`${out}/s${String(i++).padStart(2,'0')}.png`, fullPage:true, clip:{x:0,y:bx.y,width:w,height:Math.min(bx.h,3300)}}); }
  console.log(boxes.length,'slices'); await b.close();
})();
