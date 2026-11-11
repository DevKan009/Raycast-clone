const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const https = require('https');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

const cssHrefs = [];
$('link[rel="stylesheet"]').each((i, el) => {
  const href = $(el).attr('href');
  if (href) cssHrefs.push(href);
});

console.log('Found CSS hrefs:', cssHrefs);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    let fullUrl = url.startsWith('/') ? 'https://www.raycast.com' + url : url;
    https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data);
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function fetchCss() {
  const cssDir = path.join(__dirname, '..', 'reference', 'css');
  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

  for (let i = 0; i < cssHrefs.length; i++) {
    const dest = path.join(cssDir, `style_${i}.css`);
    try {
      const data = await download(cssHrefs[i], dest);
      console.log(`Saved style_${i}.css (${data.length} bytes)`);
    } catch (e) {
      console.warn(`Failed to fetch ${cssHrefs[i]}: ${e.message}`);
    }
  }
}

fetchCss();
