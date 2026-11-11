// Converts reference/snap/NN.html (rendered DOM snapshots of raycast.com sections) into React components.
// Images/videos/fonts referenced are downloaded once into public/img and rewritten to local paths.
// usage: node scripts/html_to_jsx.cjs 02:HeroShowcase 03:... (index:ComponentName)
const fs = require('fs'); const path = require('path'); const cheerio = require('cheerio'); const crypto = require('crypto');
const ORIGIN = 'https://www.raycast.com';
const OUT_IMG = 'public/img';
fs.mkdirSync(OUT_IMG, { recursive: true });
const cache = JSON.parse(fs.existsSync('reference/img_cache.json') ? fs.readFileSync('reference/img_cache.json', 'utf8') : '{}');
const pending = new Map();

function underlying(u) {
  // Next image optimizer URL -> underlying static file
  if (u.startsWith('/_next/image')) { const q = new URL(ORIGIN + u).searchParams.get('url'); if (q) return q; }
  return u;
}
function localFor(u) {
  if (!u || u.startsWith('data:') || u.startsWith('#') || u.startsWith('blob:')) return u;
  let raw = underlying(u);
  const abs = /^https?:/.test(raw) ? raw : (raw.startsWith('//') ? 'https:' + raw : ORIGIN + (raw.startsWith('/') ? '' : '/') + raw);
  if (cache[abs]) return cache[abs];
  const pathname = new URL(abs).pathname; let ext = path.extname(pathname) || '';
  const base = path.basename(pathname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const name = `${base}_${crypto.createHash('md5').update(abs).digest('hex').slice(0, 6)}${ext}`;
  cache[abs] = '/img/' + name; pending.set(abs, name); return cache[abs];
}
const camel = (s) => s.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
const SPECIAL = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', srcset: 'srcSet', crossorigin: 'crossOrigin', playsinline: 'playsInline', autoplay: 'autoPlay', maxlength: 'maxLength', readonly: 'readOnly', 'accept-charset': 'acceptCharset', contenteditable: 'contentEditable', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', 'xlink:href': 'xlinkHref', fetchpriority: 'fetchPriority', viewbox: 'viewBox', autocomplete: 'autoComplete', spellcheck: 'spellCheck', preserveaspectratio: 'preserveAspectRatio' };
const BOOL = new Set(['controls', 'autoplay', 'muted', 'loop', 'playsinline', 'disabled', 'checked', 'hidden', 'open', 'readonly', 'required', 'allowfullscreen', 'inert']);
const VOID = new Set(['img', 'br', 'hr', 'input', 'source', 'meta', 'link', 'col', 'wbr', 'track', 'area', 'base', 'embed']);

function styleObj(s) {
  const o = {};
  s.split(';').forEach((d) => { const i = d.indexOf(':'); if (i < 0) return; let k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (!k) return;
    v = v.replace(/url\((['"]?)([^)'"]+)\1\)/g, (m, q, u) => `url(${localFor(u)})`);
    k = k.startsWith('--') ? k : camel(k.replace(/^-ms-/, 'ms-')); o[k] = v; });
  return JSON.stringify(o);
}
function attrs(el, tag) {
  const out = [];
  for (const [k0, v0] of Object.entries(el.attribs || {})) {
    const k = k0.toLowerCase(); let v = v0;
    if (k === 'style') { out.push(`style={${styleObj(v)}}`); continue; }
    if (k === 'srcset' || k === 'sizes' || k === 'loading' || k === 'decoding' || k === 'fetchpriority' || k === 'data-nimg' || k.startsWith('data-radix') || k === 'xmlns:xlink') continue;
    if ((k === 'src' || k === 'poster') ) v = localFor(v);
    if (k === 'href' && tag === 'image') v = localFor(v);
    if (k === 'href' && v.startsWith('/')) v = ORIGIN + v;
    if (k === 'value' && (tag === 'input' || tag === 'textarea')) { out.push(`defaultValue=${JSON.stringify(v)}`); continue; }
    let name = SPECIAL[k] || (k.startsWith('data-') || k.startsWith('aria-') ? k : camel(k0));
    if (k.startsWith('on')) continue;
    if (BOOL.has(k) && (v === '' || v === k)) { out.push(name); continue; }
    out.push(`${name}=${JSON.stringify(v)}`);
  }
  return out.length ? ' ' + out.join(' ') : '';
}
function esc(t) { return t.replace(/[{}<>]/g, (c) => `{${JSON.stringify(c)}}`).replace(/ /g, '{"\\u00a0"}'); }
function walk(node, depth) {
  if (node.type === 'text') { const t = node.data; if (!t.trim() && t.includes('\n')) return ''; return esc(t); }
  if (node.type === 'comment' || node.type === 'script' || node.type === 'directive') return '';
  if (node.type === 'style' || node.name === 'style' || node.name === 'noscript' || node.name === 'link' || node.name === 'canvas') return '';
  if (node.type !== 'tag') return '';
  const tag = node.name; const a = attrs(node, tag);
  if (VOID.has(tag)) return `<${tag}${a} />`;
  let kids = (node.children || []).map((c) => walk(c, depth + 1)).join('');
  if (tag === 'video') { /* keep as-is */ }
  if (!kids) return `<${tag}${a}></${tag}>`;
  return `<${tag}${a}>${kids}</${tag}>`;
}

(async () => {
  for (const arg of process.argv.slice(2)) {
    const [idx, name, hook] = arg.split(':');
    const html = fs.readFileSync(`reference/snap/${idx}.html`, 'utf8');
    const $ = cheerio.load(html, { xmlMode: false }, false);
    const root = $.root().children().toArray();
    let body = root.map((n) => walk(n, 0)).join('');
    if (hook) body = body.replace(/^<([a-z0-9]+)/, '<$1 ref={ref}');
    const head = hook ? `import React, { useRef } from 'react';\nimport ${hook} from '../interactions/${hook}';` : `import React from 'react';`;
    const pre = hook ? `  const ref = useRef(null);\n  ${hook}(ref);\n` : '';
    const src = `// Generated from a snapshot of raycast.com (section ${idx}) by scripts/html_to_jsx.cjs. Behaviour lives in src/interactions.\n${head}\n\nexport default function ${name}() {\n${pre}  return (\n    ${body}\n  );\n}\n`;
    fs.mkdirSync('src/sections', { recursive: true });
    fs.writeFileSync(`src/sections/${name}.jsx`, src);
    console.log(name, src.length);
  }
  // download assets
  let n = 0;
  for (const [abs, name] of pending) {
    const dest = path.join(OUT_IMG, name); if (fs.existsSync(dest)) continue;
    try { const r = await fetch(abs); if (!r.ok) { console.log('FAIL', r.status, abs); continue; } fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); n++; } catch (e) { console.log('ERR', abs, e.message); }
  }
  fs.writeFileSync('reference/img_cache.json', JSON.stringify(cache, null, 1));
  console.log('downloaded', n, 'of', pending.size);
})();
