const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/05_section_5.html', 'utf8');
const $ = cheerio.load(html);

const kb = $('.h8MSgW_keyboard');
const row3 = kb.find('.h8MSgW_keyboardRow').eq(3);
console.log('Row 3 children:');
row3.children().each((i, el) => {
  console.log(i, $(el).attr('class'), $(el).text().trim().replace(/\s+/g, ' '));
});
