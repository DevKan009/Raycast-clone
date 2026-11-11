const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/05_section_5.html', 'utf8');
const $ = cheerio.load(html);

$('.h8MSgW_key').each((i, el) => {
  const t = $(el).text().trim().replace(/\s+/g, ' ');
  if (t.includes('Fast') || t.includes('Ergonomic') || t.includes('Personal') || t.includes('Reliable')) {
    console.log(t, '=> attrs:', $(el).attr());
  }
});
