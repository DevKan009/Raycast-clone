const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('reference/sections/12_section_12.html', 'utf8');
const $ = cheerio.load(html);

const svgs = [];
$('svg').each((i, el) => {
  const vb = $(el).attr('viewBox');
  if (vb && vb !== '0 0 16 16') {
    svgs.push({
      index: i,
      viewBox: vb,
      html: $.html(el)
    });
  }
});

console.log('Found feature illustration SVGs:', svgs.length);
fs.writeFileSync('reference/developer_illustrations.json', JSON.stringify(svgs, null, 2));
