const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/05_section_5.html', 'utf8');
const $ = cheerio.load(html);

console.log('Section 5 top children:');
$('div').each((i, el) => {
  const c = $(el).attr('class') || '';
  if (c.includes('container') || c.includes('Container') || c.includes('keyboard') || c.includes('keys')) {
    console.log(i, c, $(el).text().trim().slice(0, 50));
  }
});
