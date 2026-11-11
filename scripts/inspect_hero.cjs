const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

// Find canvas or images around hero
console.log('--- Canvas elements: ---');
$('canvas').each((i, el) => {
  console.log('Canvas:', $(el).attr('class'), $(el).parent().attr('class'));
});

console.log('--- Videos: ---');
$('video').each((i, el) => {
  console.log('Video:', $(el).attr('src'), $(el).find('source').attr('src'));
});

console.log('--- Images in top section: ---');
$('section, header, div[class*="hero"]').first().find('img').each((i, el) => {
  console.log('Img:', $(el).attr('src'), $(el).attr('alt'));
});

// Let's find elements near "shortcut to everything"
const h1 = $('h1');
console.log('H1 texts:', h1.map((i, el) => $(el).text()).get());
const mainH1 = h1.first();
let parent = mainH1.parent();
for (let i = 0; i < 5; i++) {
  console.log(`Parent ${i}: <${parent.prop('tagName')}> class="${parent.attr('class')}"`);
  parent.children().each((j, el) => {
    console.log(`   child [${j}]: <${el.tagName}> class="${$(el).attr('class')}" id="${$(el).attr('id')}"`);
  });
  parent = parent.parent();
}
