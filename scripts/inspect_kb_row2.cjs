const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/05_section_5.html', 'utf8');
const $ = cheerio.load(html);

const kb = $('.h8MSgW_keyboard');
const row2 = kb.find('.h8MSgW_keyboardRow').eq(2);
console.log('Row 2 children:');
row2.children().each((i, el) => {
  console.log(i, $(el).attr('class'), $(el).text().trim().replace(/\s+/g, ' '));
});
