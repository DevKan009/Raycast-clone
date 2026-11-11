const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/04_section_4.html', 'utf8');
const $ = cheerio.load(html);

console.log('Section 4 main children:');
$('.utU0aa_container').children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class'));
});

console.log('\nFrame content children:');
$('.utU0aa_frameContent').children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class'));
});

console.log('\nShowcase reel:');
$('.utU0aa_showcaseReel').children().each((i, el) => {
  console.log(i, el.tagName, $(el).attr('class'), $(el).text().trim().slice(0, 40));
});
