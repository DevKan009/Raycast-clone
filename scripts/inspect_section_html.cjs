const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

const outDir = path.join(__dirname, '..', 'reference', 'sections');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const rootChildren = $('#root').children();

rootChildren.each((i, el) => {
  const outer = $.html(el);
  const id = $(el).attr('id') || `section_${i}`;
  const filename = `${String(i).padStart(2, '0')}_${id}.html`;
  fs.writeFileSync(path.join(outDir, filename), outer);
  console.log(`Saved ${filename} (${outer.length} bytes)`);
});
