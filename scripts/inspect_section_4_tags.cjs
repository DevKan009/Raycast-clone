const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/04_section_4.html', 'utf8');
const $ = cheerio.load(html);

console.log('Direct children count:', $.root().children().first().children().length);
$.root().children().first().children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class'));
});

// Let's inspect text inside
console.log('\nText breakdown:');
$('*').each((i, el) => {
  const c = $(el).attr('class') || '';
  if (c.includes('container') || c.includes('Container') || c.includes('card') || c.includes('showcase') || c.includes('mockup') || c.includes('frame')) {
    console.log(el.tagName, c, $(el).text().trim().slice(0, 60));
  }
});
