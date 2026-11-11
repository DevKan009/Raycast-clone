const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

const svgs = [];
$('svg').each((i, el) => {
  const outer = $.html(el);
  const parent = $(el).parent();
  const parentTag = parent.prop('tagName');
  const parentClass = parent.attr('class') || '';
  const ariaLabel = $(el).attr('aria-label') || parent.attr('aria-label') || '';
  
  svgs.push({
    index: i,
    parentTag,
    parentClass: parentClass.slice(0, 50),
    ariaLabel,
    viewBox: $(el).attr('viewBox'),
    width: $(el).attr('width'),
    height: $(el).attr('height'),
    html: outer
  });
});

console.log(`Found ${svgs.length} SVGs.`);
fs.writeFileSync('reference/svgs.json', JSON.stringify(svgs, null, 2));

// Let's identify the logo SVG
const logoSvgs = svgs.filter(s => s.html.includes('M11.666') || s.html.includes('Raycast') || s.ariaLabel.toLowerCase().includes('raycast') || s.index === 0);
console.log('Logo SVGs count:', logoSvgs.length);
if (logoSvgs.length > 0) {
  console.log('First SVG sample:', logoSvgs[0].html.slice(0, 200));
}
