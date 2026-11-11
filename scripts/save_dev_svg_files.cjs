const fs = require('fs');
const path = require('path');

const svgs = JSON.parse(fs.readFileSync('reference/developer_illustrations.json', 'utf8'));

const assetsDir = path.join(__dirname, '..', 'public', 'assets');

fs.writeFileSync(path.join(assetsDir, 'dev_cross_platform.svg'), svgs[0].html);
fs.writeFileSync(path.join(assetsDir, 'dev_builtin_ui.svg'), svgs[2].html);
fs.writeFileSync(path.join(assetsDir, 'dev_batteries_included.svg'), svgs[3].html);
fs.writeFileSync(path.join(assetsDir, 'dev_publish_store.svg'), svgs[4].html);

console.log('Saved 4 developer illustration SVGs to public/assets/');
