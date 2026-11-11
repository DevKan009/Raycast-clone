const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/08_section_8.html', 'utf8');
const $ = cheerio.load(html);

console.log('Testimonials count:', $('img').length);
$('img').each((i, el) => {
  const p = $(el).parent().parent();
  const name = p.find('[class*="name"], strong, b').text().trim() || p.text().trim().slice(0, 30);
  console.log(i, $(el).attr('src'), name);
});
