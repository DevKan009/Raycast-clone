const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/04_section_4.html', 'utf8');
const $ = cheerio.load(html);

console.log('Heading 2:', $('h2').text());
console.log('Subtitle:', $('h2').parent().find('p').text());
console.log('Tabs / Filters:');
$('[role="tab"], button, .tab').each((i, el) => {
  console.log('  Tab/Btn:', $(el).text().trim());
});
console.log('Search input:', $('input').map((_, el) => $(el).attr('placeholder')).get());
console.log('List items / sections:');
$('ul, [role="list"], .IS8qgq_searchSectionHeader, .IS8qgq_searchItem').each((i, el) => {
  const text = $(el).text().trim().replace(/\s+/g, ' ');
  if (text.length < 80) console.log('  Item:', text);
});
