// usage: node scripts/record_replay.cjs showcase|features
// Records one full cycle of a scripted demo on raycast.com (the "Take shortcuts" showcase or the feature wall) (typing, results, AI answer,
// emoji picker, calculator, window management) as HTML frames, localises its images, and writes it as
// splice-compressed segments (one per dock item) to public/showcase.json for src/interactions/useShortcuts.js.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const ORIGIN = 'https://www.raycast.com';
const PRESETS = {
  showcase: { out: 'public/showcase.json', anchor: '[class*=showcaseReel]', items: '[class*=_dock] [class*=_item]', min: 5 },
  features: { out: 'public/features.json', anchor: '[class*=_wall]', items: '[class*=_wall] [class*=_text][role=button]', min: 12, byLabel: true },
};
const PRESET = PRESETS[process.argv[2] || 'showcase']; const W = 1440; const H = 900; const OUT = PRESET.out;
const cache = JSON.parse(fs.existsSync('reference/img_cache.json') ? fs.readFileSync('reference/img_cache.json', 'utf8') : '{}');
const pending = new Map();
function localFor(u0) {
  let u = u0.replace(/&amp;/g, '&');
  if (!u || u.startsWith('data:') || u.startsWith('#') || u.startsWith('blob:') || u.startsWith('/img/') || u.startsWith('/media/')) return u0;
  if (u.startsWith('/_next/image')) { const q = new URL(ORIGIN + u).searchParams.get('url'); if (q) u = q; }
  const abs = /^https?:/.test(u) ? u : ORIGIN + (u.startsWith('/') ? '' : '/') + u;
  if (cache[abs]) return cache[abs];
  const pathname = new URL(abs).pathname; const ext = path.extname(pathname) || '';
  const base = decodeURIComponent(path.basename(pathname, ext)).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const name = `${base}_${crypto.createHash('md5').update(abs).digest('hex').slice(0, 6)}${ext}`;
  cache[abs] = '/img/' + name; pending.set(abs, name); return cache[abs];
}
const localise = (html) => html
  .replace(/ (srcset|sizes|loading|decoding|fetchpriority|data-nimg)="[^"]*"/g, '')
  .replace(/ src="([^"]+)"/g, (m, u) => ` src="${localFor(u)}"`)
  .replace(/url\((&quot;|'|)([^)'"&]+)\1\)/g, (m, q, u) => `url(${q}${localFor(u)}${q})`);

(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2500);
  const frames = await p.evaluate(async (P) => {
    const reel = document.querySelector(P.anchor);
    const root = reel.closest('[class*=sectionContainer]');
    reel.scrollIntoView({ block: 'center' });
    const stars = root.querySelector('[class*=_stars]'); const starsHTML = stars ? stars.outerHTML : null;
    const active = () => [...root.querySelectorAll(P.items)].findIndex((i) => /_active/.test(i.className));
    const ser = () => { const h = root.innerHTML; return stars ? h.replace(stars.outerHTML, starsHTML) : h; };
    const label = () => { const e = [...root.querySelectorAll(P.items)].find((i) => /_active/.test(i.className)); return e ? e.textContent.trim() : ''; };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // wait for the cycle to wrap around to the first dock item
    let prev = active(); const t0 = performance.now();
    while (performance.now() - t0 < 150000) { await sleep(30); const a = active(); if (P.byLabel ? a !== prev : (a === 0 && prev !== 0)) break; prev = a; }
    const out = []; let dirty = true; let seen = new Set([0]); let last = 0; const labels = new Set(); let lastLabel = label(); const start = performance.now();
    const mo = new MutationObserver((ms) => { if (ms.some((m) => !(stars && stars.contains(m.target)))) dirty = true; });
    mo.observe(root, { subtree: true, attributes: true, childList: true, characterData: true });
    if (P.byLabel) { // rotation order is random on the live site: click each sentence in turn and capture its panel
      for (const item of [...root.querySelectorAll(P.items)]) {
        const name = item.textContent.trim(); item.click(); const c0 = performance.now();
        while (performance.now() - c0 < 1600) { await new Promise((r) => requestAnimationFrame(r)); if (dirty) { dirty = false; out.push({ t: Math.round(performance.now() - start), a: name, sl: 0, h: ser() }); } }
      }
      mo.disconnect(); return out;
    }
    while (performance.now() - start < 240000) {
      await new Promise((r) => requestAnimationFrame(r));
      const a = active();
      const l = label();
      if (P.byLabel) { if (l !== lastLabel && labels.size >= P.min) break; labels.add(l); lastLabel = l; } else if (a === 0 && last !== 0 && seen.size >= P.min) break;
      seen.add(a); last = a;
      if (dirty) { dirty = false; out.push({ t: Math.round(performance.now() - start), a: P.byLabel ? l : a, sl: Math.round(reel.scrollLeft), h: ser() }); }
    }
    mo.disconnect();
    return out;
  }, PRESET);
  await b.close();
  console.log('frames', frames.length, 'duration', frames.length && frames[frames.length - 1].t);
  // split into per-dock-item segments and splice-compress
  const segs = [];
  let cur = null; let prevHtml = '';
  for (const f of frames) {
    const html = localise(f.h);
    if (!cur || cur.a !== f.a) { cur = { a: f.a, t0: f.t, key: html, frames: [] }; segs.push(cur); prevHtml = html; continue; }
    if (html === prevHtml) continue;
    let s = 0; const max = Math.min(html.length, prevHtml.length);
    while (s < max && html[s] === prevHtml[s]) s++;
    let e = 0; while (e < max - s && html[html.length - 1 - e] === prevHtml[prevHtml.length - 1 - e]) e++;
    cur.frames.push([f.t - cur.t0, s, prevHtml.length - s - e, html.slice(s, html.length - e)]);
    prevHtml = html;
  }
  let outSegs = segs;
  segs.forEach((s, i) => { s.dur = (segs[i + 1] ? segs[i + 1].t0 : frames[frames.length - 1].t + 400) - s.t0; delete s.t0; });
  if (PRESET.byLabel) { segs.forEach((s) => { s.dur = 5000; }); const seen = new Set(); outSegs = segs.filter((s) => !seen.has(s.a) && seen.add(s.a)); }
  fs.writeFileSync(OUT, JSON.stringify(outSegs));
  let n = 0;
  for (const [abs, name] of pending) {
    const dest = path.join('public/img', name); if (fs.existsSync(dest)) continue;
    try { const r = await fetch(abs); if (!r.ok) { console.log('FAIL', r.status, abs); continue; } fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); n++; } catch (e) { console.log('ERR', abs, e.message); }
  }
  fs.writeFileSync('reference/img_cache.json', JSON.stringify(cache, null, 1));
  console.log(outSegs.map((s) => `seg${s.a}: ${s.frames.length} frames, ${Math.round(s.dur / 100) / 10}s, key ${s.key.length}`).join('\n'));
  console.log('json bytes', fs.statSync(OUT).size, 'images downloaded', n);
})();
