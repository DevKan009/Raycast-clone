const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/06_section_6.html', 'utf8');
const $ = cheerio.load(html);

console.log('Section 6 children:');
$('div').each((i, el) => {
  const c = $(el).attr('class') || '';
  if (c.includes('container') || c.includes('track') || c.includes('carousel') || c.includes('slider') || c.includes('card')) {
    console.log(i, c, $(el).text().trim().slice(0, 40));
  }
});

console.log('\nButtons / links in section 6:');
$('button, a').each((i, el) => {
  const t = $(el).text().trim().replace(/\s+/g, ' ');
  if (t) console.log(i, el.tagName, t.slice(0, 40), $(el).attr('href') || '');
});
