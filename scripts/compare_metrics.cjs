const fs = require('fs');
const path = require('path');

const refDir = path.join(__dirname, '..', 'reference');
const localDir = path.join(refDir, 'local');

console.log('Reference files:');
fs.readdirSync(refDir).filter(f => f.endsWith('.png')).forEach(f => {
  const stat = fs.statSync(path.join(refDir, f));
  console.log(`  ${f}: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
});

console.log('\nLocal files:');
fs.readdirSync(localDir).filter(f => f.endsWith('.png')).forEach(f => {
  const stat = fs.statSync(path.join(localDir, f));
  console.log(`  ${f}: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
});
