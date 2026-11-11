const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/05_section_5.html', 'utf8');
const $ = cheerio.load(html);

const kb = $('.h8MSgW_keyboard');
console.log('Keyboard classes:', kb.attr('class'));
console.log('Rows count:', kb.find('.h8MSgW_keyboardRow').length);
kb.find('.h8MSgW_keyboardRow').each((i, row) => {
  console.log(`Row #${i}:`);
  $(row).children().each((j, key) => {
    const text = $(key).text().trim().replace(/\s+/g, ' ');
    const cls = $(key).attr('class') || '';
    if (text.length > 5) {
      console.log(`   Key [${text}] (${cls.slice(0, 30)})`);
    }
  });
});
