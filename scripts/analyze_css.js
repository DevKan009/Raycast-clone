const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', 'reference', 'css');
const files = fs.readdirSync(cssDir);

const allVars = new Set();
const allKeyframes = new Set();

for (const file of files) {
  const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
  // Match CSS variables --var-name: ...;
  const varMatches = content.match(/--[a-zA-Z0-9_-]+:[^;]+/g);
  if (varMatches) {
    varMatches.forEach(v => allVars.add(v.trim()));
  }
  // Match keyframes
  const kfMatches = content.match(/@keyframes\s+([a-zA-Z0-9_-]+)/g);
  if (kfMatches) {
    kfMatches.forEach(k => allKeyframes.add(k.trim()));
  }
}

console.log('--- CSS Variables Sample ---');
Array.from(allVars).slice(0, 40).forEach(v => console.log('  ', v));

console.log('\n--- Keyframes ---');
Array.from(allKeyframes).forEach(k => console.log('  ', k));
