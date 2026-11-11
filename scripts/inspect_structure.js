const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

console.log('Body children:');
$('body').children().each((i, elem) => {
  console.log(i, elem.tagName, elem.attribs);
});

console.log('\nSearching for key containers:');
console.log('div#__next exists:', $('#__next').length);
console.log('div[id]:', $('div[id]').map((_, e) => e.attribs.id).get());
console.log('all a count:', $('a').length);
console.log('all button count:', $('button').length);
console.log('all img count:', $('img').length);
