const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- Inspecting #root ---');
const rootChildren = $('#root').children();
console.log('Root children count:', rootChildren.length);
rootChildren.each((i, el) => {
  console.log(`Child #${i}: <${el.tagName} id="${$(el).attr('id') || ''}" class="${($(el).attr('class') || '').slice(0, 60)}">`);
  console.log(`  Immediate children: ${$(el).children().length}`);
  const h = $(el).find('h1, h2, h3, h4, h5, h6').map((_, item) => `${item.tagName}: ${$(item).text().trim().replace(/\s+/g, ' ')}`).get();
  console.log(`  Headings: ${h.join(' | ')}`);
});
