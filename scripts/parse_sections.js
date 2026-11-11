const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- HEADER / NAV ---');
const nav = $('header, nav');
console.log('Nav links:');
$('nav a, header a').each((i, el) => {
  console.log(`  [${$(el).text().trim().replace(/\s+/g, ' ')}] -> ${$(el).attr('href')}`);
});
console.log('Nav buttons:');
$('nav button, header button').each((i, el) => {
  console.log(`  Button: "${$(el).text().trim().replace(/\s+/g, ' ')}"`);
});

console.log('\n--- MAIN SECTIONS ---');
$('main > *').each((i, el) => {
  const tag = el.tagName;
  const id = $(el).attr('id') || '';
  const className = $(el).attr('class') || '';
  const textSample = $(el).text().trim().slice(0, 150).replace(/\s+/g, ' ');
  const headings = $(el).find('h1, h2, h3, h4, h5, h6').map((_, h) => `${h.tagName}: ${$(h).text().trim().replace(/\s+/g, ' ')}`).get();
  console.log(`\nSection #${i} <${tag} id="${id}" class="${className.slice(0, 50)}...">`);
  console.log(`  Headings: ${headings.join(' | ')}`);
  console.log(`  Text sample: ${textSample}`);
  console.log(`  Images: ${$(el).find('img').length}, SVGs: ${$(el).find('svg').length}, Buttons: ${$(el).find('button').length}, Links: ${$(el).find('a').length}`);
});

console.log('\n--- FOOTER ---');
const footer = $('footer');
console.log('Footer headings:', footer.find('h1, h2, h3, h4, h5, h6').map((_, h) => $(h).text().trim()).get());
console.log('Footer links count:', footer.find('a').length);
footer.find('a').each((i, el) => {
  const t = $(el).text().trim().replace(/\s+/g, ' ');
  if (t) console.log(`  Footer link: [${t}] -> ${$(el).attr('href')}`);
});
