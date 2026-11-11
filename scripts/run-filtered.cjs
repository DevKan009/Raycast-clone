#!/usr/bin/env node
// Runs a command and prints only the useful part of its output.
// Usage: node scripts/run-filtered.cjs <command...>   e.g. node scripts/run-filtered.cjs npm run build
// - exit 0: last few lines only
// - non-zero: lines matching error patterns (+5 lines of context after), capped at 100 lines
// - preserves the command's exit code (a plain `| grep | head` pipe would hide it)
const { spawnSync } = require('node:child_process');

const cmd = process.argv.slice(2).join(' ');
if (!cmd) {
  console.error('usage: node scripts/run-filtered.cjs <command...>');
  process.exit(2);
}

const r = spawnSync(cmd, { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const lines = `${r.stdout || ''}${r.stderr || ''}`.split(/\r?\n/);
const code = r.status ?? 1;
const PATTERN = /FAIL|ERROR|Error|error|Expected|Received|warning|Cannot|not found|undefined/;
const CAP = 100;

if (code === 0) {
  console.log(lines.filter(Boolean).slice(-5).join('\n'));
  console.log(`[exit 0, ${lines.length} lines of output suppressed]`);
  process.exit(0);
}

const keep = new Set();
lines.forEach((l, i) => {
  if (PATTERN.test(l)) for (let j = i; j <= Math.min(i + 5, lines.length - 1); j++) keep.add(j);
});
const out = keep.size ? [...keep].sort((a, b) => a - b).map((i) => lines[i]) : lines.slice(-40);
console.log(out.slice(0, CAP).join('\n'));
if (out.length > CAP) console.log(`[truncated: ${out.length - CAP} more matching lines]`);
console.log(`[exit ${code}]`);
process.exit(code);
