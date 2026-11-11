const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- H3BVAa_heroBackground HTML: ---');
console.log($('.H3BVAa_heroBackground').html());

// Search for H3BVAa_heroBackground in CSS files
const cssFiles = fs.readdirSync('reference/css');
for (const file of cssFiles) {
  const content = fs.readFileSync('reference/css/' + file, 'utf8');
  if (content.includes('H3BVAa_heroBackground') || content.includes('heroBackground')) {
    console.log(`Found in ${file}:`);
    const idx = content.indexOf('heroBackground');
    console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 400)));
  }
}
