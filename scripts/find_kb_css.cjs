const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', 'reference', 'css');
const files = fs.readdirSync(cssDir);

for (const file of files) {
  const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  if (content.includes('h8MSgW_key')) {
    console.log(`Found in ${file}:`);
    const matches = content.match(/\.h8MSgW_[a-zA-Z0-9_-]+{[^}]+}/g);
    if (matches) {
      matches.slice(0, 15).forEach(m => console.log('  ', m));
    }
  }
}
