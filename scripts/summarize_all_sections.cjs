const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const sectionsDir = path.join(__dirname, '..', 'reference', 'sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const html = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
  const $ = cheerio.load(html);
  
  console.log(`\n======================================================`);
  console.log(`FILE: ${file}`);
  const headings = $('h1, h2, h3, h4, h5, h6').map((_, el) => `${el.tagName}: ${$(el).text().trim()}`).get();
  console.log(`Headings: ${headings.join(' | ')}`);
  
  const pList = $('p').map((_, el) => $(el).text().trim()).get().filter(t => t.length > 0 && t.length < 200);
  if (pList.length > 0) {
    console.log(`Paragraphs: ${pList.slice(0, 5).join(' || ')}`);
  }
  
  const imgs = $('img').map((_, el) => ({
    alt: $(el).attr('alt') || '',
    src: $(el).attr('src')
  })).get();
  if (imgs.length > 0) {
    console.log(`Images (${imgs.length}): ${imgs.slice(0, 5).map(img => img.alt || path.basename(img.src.split('?')[0])).join(', ')}`);
  }

  const buttons = $('button, a._3dJGfa_button').map((_, el) => $(el).text().trim()).get().filter(t => t.length > 0);
  if (buttons.length > 0) {
    console.log(`Buttons: ${buttons.join(', ')}`);
  }
});
