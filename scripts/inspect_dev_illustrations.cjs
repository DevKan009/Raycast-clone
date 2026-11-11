const fs = require('fs');
const svgs = JSON.parse(fs.readFileSync('reference/developer_illustrations.json', 'utf8'));

console.log('Developer illustrations summary:');
svgs.forEach((s, i) => {
  console.log(`SVG #${i}: viewBox=${s.viewBox}, length=${s.html.length}`);
});
