// node qa_diff.cjs refDir locDir pairs e.g. "01:00,02:01"  prints %diff between slice images (cropped to common size)
const {PNG}=require('pngjs');const pm=require('pixelmatch').default||require('pixelmatch');const fs=require('fs');
const [r,l,pairs]=process.argv.slice(2);
for(const pr of pairs.split(',')){const [a,b]=pr.split(':');const A=PNG.sync.read(fs.readFileSync(`${r}/s${a}.png`)),B=PNG.sync.read(fs.readFileSync(`${l}/s${b}.png`));
const w=Math.min(A.width,B.width),h=Math.min(A.height,B.height);const crop=(P)=>{const o=new PNG({width:w,height:h});PNG.bitblt(P,o,0,0,w,h,0,0);return o};
const d=pm(crop(A).data,crop(B).data,null,w,h,{threshold:0.15});console.log(pr,`ref ${A.height} loc ${B.height} diff ${(100*d/(w*h)).toFixed(1)}%`)}
