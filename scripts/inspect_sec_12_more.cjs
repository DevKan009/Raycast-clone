const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/12_section_12.html', 'utf8');
const $ = cheerio.load(html);

console.log('Top level children:');
$.root().children().first().children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class'), $(el).text().trim().slice(0, 60));
});

// Look at the SVG code inside section 12
$('svg').each((i, el) => {
  console.log(`SVG #${i}: viewBox="${$(el).attr('viewBox')}" width="${$(el).attr('width')}" class="${$(el).attr('class')}"`);
});
