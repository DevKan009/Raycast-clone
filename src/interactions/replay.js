// Replays a recorded scripted demo (see scripts/record_replay.cjs) inside `root`.
// A recording is a list of segments: { a: id, key: full innerHTML, frames: [[ms, start, deleteCount, insert]], dur }.
// Frames are applied with a small DOM morph so CSS transitions, caret blinks and the star field keep running.

function syncAttrs(from, to) {
  for (const { name } of [...from.attributes]) if (!to.hasAttribute(name)) from.removeAttribute(name);
  for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value);
}

function morph(from, to) {
  const a = [...from.childNodes]; const b = [...to.childNodes];
  for (let i = 0; i < b.length; i += 1) {
    const o = a[i]; const n = b[i];
    if (!o) { from.appendChild(n.cloneNode(true)); continue; }
    if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) { from.replaceChild(n.cloneNode(true), o); continue; }
    if (o.nodeType === 1) {
      if (typeof o.className === 'string' && o.className.includes('_stars')) continue; // live star field, leave alone
      syncAttrs(o, n); morph(o, n);
    } else if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
  }
  for (let i = a.length - 1; i >= b.length; i -= 1) from.removeChild(a[i]);
}

/**
 * @param root      element whose innerHTML the recording describes
 * @param url       recording JSON (served from /public)
 * @param opts.pick (eventTarget, segments) => segment index the user asked for, or -1
 * @param opts.onSegment (index, smooth) => void, called whenever a segment starts
 * @param opts.transform (html) => html, applied to every frame before it is rendered (e.g. responsive values)
 * @param opts.watch element used for the on-screen check (defaults to root)
 * @returns cleanup function; cleanup.refresh() re-renders the current frame (after a resize)
 */
export default function createReplay(root, url, { pick, onSegment = () => {}, watch, transform = (h) => h } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tpl = document.createElement('template');
  let segs = null; let seg = 0; let html = ''; let timers = []; let visible = false; let playing = false; let dead = false;

  const apply = (h) => { html = h; tpl.innerHTML = transform(h); morph(root, tpl.content); };
  const stop = () => { timers.forEach(clearTimeout); timers = []; playing = false; };
  const play = (i, smooth = true) => {
    if (!segs) return;
    stop(); seg = (i + segs.length) % segs.length; playing = true;
    const s = segs[seg];
    apply(s.key); onSegment(seg, smooth);
    if (reduced) { // show the finished state instead of animating it
      let h = s.key; s.frames.forEach(([, st, del, ins]) => { h = h.slice(0, st) + ins + h.slice(st + del); });
      apply(h); playing = false; return;
    }
    s.frames.forEach(([t, st, del, ins]) => timers.push(setTimeout(() => apply(html.slice(0, st) + ins + html.slice(st + del)), t)));
    timers.push(setTimeout(() => play(seg + 1), s.dur));
  };

  const choose = (e) => { const i = pick ? pick(e.target, segs || []) : -1; if (i >= 0) { e.preventDefault(); play(i); } };
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') choose(e); };
  root.addEventListener('click', choose); root.addEventListener('keydown', onKey);

  // only run while on screen; restart the current segment when it comes back into view
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && segs && !playing) play(seg, false);
    if (!visible && !reduced) stop();
  }, { threshold: 0.2 });
  io.observe(watch || root);

  fetch(url).then((r) => r.json()).then((data) => {
    if (dead) return;
    segs = data;
    if (visible) play(0, false); else apply(segs[0].key);
  }).catch(() => { /* recording unavailable: the static markup stays */ });

  const cleanup = () => { dead = true; stop(); io.disconnect(); root.removeEventListener('click', choose); root.removeEventListener('keydown', onKey); };
  cleanup.refresh = () => { if (html) apply(html); };
  return cleanup;
}
