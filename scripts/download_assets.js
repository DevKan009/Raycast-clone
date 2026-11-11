const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const crypto = require('crypto');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Extract all image tags with their attributes
const imageTags = [];
$('img').each((i, el) => {
  const src = $(el).attr('src');
  if (src) {
    imageTags.push({
      index: i,
      src,
      alt: $(el).attr('alt') || '',
      width: $(el).attr('width'),
      height: $(el).attr('height')
    });
  }
});

console.log(`Found ${imageTags.length} image elements.`);

function getCleanFilename(src, index) {
  let targetUrl = src;
  if (src.includes('url=')) {
    try {
      const parsed = decodeURIComponent(src.split('url=')[1].split('&')[0]);
      targetUrl = parsed;
    } catch (e) {}
  }
  
  // Extract basename without query
  const base = path.basename(targetUrl.split('?')[0]);
  const ext = path.extname(base) || '.png';
  const nameWithoutExt = path.basename(base, ext).split('.')[0]; // remove hash like .3bxd817ow3sdx
  
  // Create clean safe name
  const safeName = `${nameWithoutExt}_${index}${ext}`.replace(/[^a-zA-Z0-9._-]/g, '_');
  return safeName;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    let fullUrl = url;
    if (url.startsWith('/')) {
      fullUrl = 'https://www.raycast.com' + url;
    }
    
    const client = fullUrl.startsWith('https') ? https : http;
    const req = client.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${fullUrl}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.abort();
      reject(new Error(`Timeout for ${fullUrl}`));
    });
  });
}

async function downloadAll() {
  const urlToLocal = {};
  const inventory = [];

  for (let i = 0; i < imageTags.length; i++) {
    const item = imageTags[i];
    const filename = getCleanFilename(item.src, i);
    const localPath = path.join(ASSETS_DIR, filename);
    const localPublicUrl = `/assets/${filename}`;

    try {
      if (!fs.existsSync(localPath)) {
        await download(item.src, localPath);
      }
      urlToLocal[item.src] = localPublicUrl;
      inventory.push({
        ...item,
        localFile: filename,
        localUrl: localPublicUrl
      });
      console.log(`[${i + 1}/${imageTags.length}] Saved ${filename}`);
    } catch (err) {
      console.warn(`[${i + 1}/${imageTags.length}] Failed ${item.src}: ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(__dirname, '..', 'reference', 'images_inventory.json'), JSON.stringify(inventory, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'reference', 'url_to_local.json'), JSON.stringify(urlToLocal, null, 2));
  console.log('Saved images inventory and mapping.');
}

downloadAll();
