const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/12_section_12.html', 'utf8');
const $ = cheerio.load(html);

console.log('Section 12 details:');
console.log('Headings:', $('h1, h2, h3, h4, h5, h6').map((_, el) => `${el.tagName}: ${$(el).text().trim()}`).get());
console.log('SVGs count:', $('svg').length);
console.log('Code blocks / pre count:', $('pre, code').length);
$('h4').each((i, el) => {
  const heading = $(el).text().trim();
  const nextP = $(el).parent().find('p').text().trim();
  console.log(`- ${heading}: ${nextP.slice(0, 80)}`);
});
