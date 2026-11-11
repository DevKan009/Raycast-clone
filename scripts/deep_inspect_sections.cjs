const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// 1. Inspect WinGet dialog in Section 3
const sec3 = fs.readFileSync('reference/sections/03_section_3.html', 'utf8');
const $3 = cheerio.load(sec3);
console.log('--- SECTION 3 (Hero) ---');
console.log('WinGet trigger button:', $3('.j3Kqfa_trigger').text().trim());

// 2. Inspect Section 4 (Shortcuts layout)
const sec4 = fs.readFileSync('reference/sections/04_section_4.html', 'utf8');
const $4 = cheerio.load(sec4);
console.log('\n--- SECTION 4 (Shortcuts) ---');
console.log('Classes containing preview/detail:', $4('*').map((_, el) => {
  const c = $4(el).attr('class') || '';
  return c.includes('detail') || c.includes('preview') || c.includes('Detail') || c.includes('Preview') || c.includes('right') ? c : null;
}).get().filter(Boolean).slice(0, 10));

// 3. Inspect Section 7 (AI Tabs)
const sec7 = fs.readFileSync('reference/sections/07_section_7.html', 'utf8');
const $7 = cheerio.load(sec7);
console.log('\n--- SECTION 7 (AI) ---');
console.log('Tabs:', $7('[role="tab"], button').map((_, el) => $7(el).text().trim()).get().filter(Boolean));
console.log('Headings:', $7('h2, h3, h4').map((_, el) => `${el.tagName}: ${$7(el).text().trim()}`).get());

// 4. Inspect Section 10 (What else can Raycast do)
const sec10 = fs.readFileSync('reference/sections/10_section_10.html', 'utf8');
const $10 = cheerio.load(sec10);
console.log('\n--- SECTION 10 (What else) ---');
console.log('Item titles:', $10('h4, h5, [class*="title"]').map((_, el) => $10(el).text().trim()).get().filter(Boolean).slice(0, 15));
console.log('Has tabs or buttons:', $10('button').map((_, el) => $10(el).text().trim()).get().filter(Boolean));
