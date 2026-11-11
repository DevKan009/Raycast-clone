const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('reference/sections/04_section_4.html', 'utf8');
const $ = cheerio.load(html);

console.log('MenuBar HTML:');
console.log($('.utU0aa_menuBar').html());

console.log('\nDock HTML:');
console.log($('.utU0aa_dock').html());
