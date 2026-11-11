// node css_rules.cjs <classPrefixRegex> : prints matching rules with their @media context from reference/css
const fs=require('fs');const re=new RegExp(process.argv[2]);
for(const f of fs.readdirSync('reference/css')){const css=fs.readFileSync('reference/css/'+f,'utf8');
 const walk=(s,ctx)=>{let i=0;while(i<s.length){const b=s.indexOf('{',i);if(b<0)break;const sel=s.slice(i,b).trim();let d=1,j=b+1;while(d&&j<s.length){if(s[j]=='{')d++;else if(s[j]=='}')d--;j++}const body=s.slice(b+1,j-1);
  if(sel.startsWith('@media'))walk(body,sel.replace('@media screen and ','').replace('@media ',''));else if(sel.startsWith('@')){}else if(re.test(sel))console.log((ctx?'['+ctx+'] ':'')+sel+'{'+body+'}');i=j}};walk(css,'');}
