import { useEffect } from 'react';

// "AI Extensions" bento card: a scripted chat run. The prompt bubble pops in, the tool-call row works
// through four steps (shimmering label, app icons stacking, count ticking up), settles on its summary,
// then the answer streams in word by word. It holds, fades and loops while the card is on screen.
// The markup and class names are the ones raycast.com renders for the finished state.

const GRANOLA = '/img/app-granola.svg'; // stand-in drawn locally; swap for the real app icon when available
const THINGS = '/img/app-things_431g4_1xy5twk_35c8d4.webp';

const icon = (src, size) => `<img alt="" width="${size}" height="${size}" decoding="async" class="ACYmNa_icon" src="${src}" style="color:transparent;width:${size}px;height:${size}px">`;
const pill = (src, name) => `<span class="Ue6KlW_pill">${icon(src, 14)}<span class="Ue6KlW_text">${name}</span></span>`;

const STEPS = [
  { src: GRANOLA, busy: 'Finding meetings', done: 'Found meetings: 6 meetings from last week' },
  { src: GRANOLA, busy: 'Reading transcripts', done: 'Read transcripts: Found 5 action items assigned to you across 6 transcripts' },
  { src: THINGS, busy: 'Checking existing tasks', done: 'Checked existing tasks: Searched active and completed tasks for each action item' },
  { src: THINGS, busy: 'Creating tasks', done: 'Created 3 tasks: Added the remaining action items with links to their Granola meeting notes' },
];
const SUMMARY = 'Reviewed meetings and updated Things';

// [parent, tag, text] in reading order; streamed one word at a time
const ANSWER = [
  ['root', 'p', 'I reviewed 6 meetings from last week and added 3 new tasks to Things:'],
  ['root', 'ul', ''],
  ['ul', 'li', '- Share the updated homepage mockups with Maya'],
  ['ul', 'li', '- Send Alex feedback on the pricing proposal'],
  ['ul', 'li', '- Prepare the customer interview questions'],
  ['root', 'p', 'The launch checklist and onboarding metrics tasks were already there, so I skipped them. Each new task includes a link to its Granola notes.'],
];

const BUBBLE = `<div class="_2Bjs8W_message"><div class="_2Bjs8W_bubble">Read my ${pill(GRANOLA, 'Granola')} transcripts from last week and add any action items to ${pill(THINGS, 'Things')}.</div></div>`;

const GROUP = `<div class="lSQKOG_group"><button type="button" tabindex="-1" aria-expanded="false" class="lSQKOG_summaryRow" data-open="false"><span aria-hidden="true" class="lSQKOG_glyphSlot"><span class="lSQKOG_iconStack"></span></span><span class="lSQKOG_summary"><span class="m8tKeW_label lSQKOG_label" data-loading="true"></span><span class="lSQKOG_count"></span></span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-hidden="true" class="lSQKOG_chevron"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 5.75 9.25 8l-2.5 2.25"></path></svg></button><div class="lSQKOG_content" hidden="">${STEPS.map((s) => `<div class="GQu64q_toolCall"><span aria-hidden="true" class="GQu64q_icon">${icon(s.src, 16)}</span><span class="m8tKeW_label" data-loading="false">${s.done}</span></div>`).join('')}</div></div>`;

const EASE = 'cubic-bezier(.23,1,.32,1)';
const BOTTOM = 'translateX(-4px) scale(0.875) rotate(-10deg)';
const TOP = 'translateX(4px) translateY(-1px) rotate(3deg)';
const stackItem = (src, pos, transform) => `<span class="lSQKOG_iconStackItem" data-position="${pos}" style="opacity:1;transform:${transform};transition:transform .35s ${EASE},opacity .25s">${icon(src, 16)}</span>`;

export default function useAIWorkflow(ref) {
  useEffect(() => {
    const root = ref.current && ref.current.querySelector('.IpUO_a_workflow');
    if (!root) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timers = []; let playing = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const stop = () => { timers.forEach(clearTimeout); timers = []; playing = false; };
    const enter = (el) => el.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 450, easing: EASE },
    );
    const add = (html) => { root.insertAdjacentHTML('beforeend', html); return root.lastElementChild; };

    // icons: the current step's app sits on top of the previous step's
    const setStack = (stack, i) => {
      const top = stack.querySelector('[data-position="top"],[data-position="single"]');
      stack.querySelectorAll('[data-position="bottom"]').forEach((el) => el.remove());
      if (!top) { stack.innerHTML = stackItem(STEPS[i].src, 'single', 'none'); return; }
      top.dataset.position = 'bottom'; top.style.transform = BOTTOM;
      stack.insertAdjacentHTML('beforeend', stackItem(STEPS[i].src, 'top', 'translateX(10px) rotate(12deg)'));
      const next = stack.lastElementChild; next.style.opacity = '0';
      requestAnimationFrame(() => { next.style.opacity = '1'; next.style.transform = TOP; });
    };

    const final = () => {
      root.innerHTML = BUBBLE + GROUP;
      const g = root.lastElementChild;
      g.querySelector('.lSQKOG_iconStack').innerHTML = stackItem(THINGS, 'bottom', BOTTOM) + stackItem(THINGS, 'top', TOP);
      const label = g.querySelector('.lSQKOG_label'); label.textContent = SUMMARY; label.dataset.loading = 'false';
      g.querySelector('.lSQKOG_count').textContent = String(STEPS.length);
      const msg = add('<div class="dSRCBG_message"></div>'); let ul = null;
      ANSWER.forEach(([parent, tag, text]) => {
        const el = document.createElement(tag); el.textContent = text;
        (parent === 'ul' ? ul : msg).appendChild(el); if (tag === 'ul') ul = el;
      });
    };

    const play = () => {
      stop(); playing = true;
      root.getAnimations().forEach((a) => a.cancel());
      root.innerHTML = '';
      let t = 300;
      at(t, () => enter(add(BUBBLE)));
      t += 1000;
      let group;
      at(t, () => { group = add(GROUP); group.querySelector('.lSQKOG_count').hidden = true; enter(group); });
      STEPS.forEach((s, i) => {
        at(t + 20, () => {
          setStack(group.querySelector('.lSQKOG_iconStack'), i);
          group.querySelector('.lSQKOG_label').textContent = s.busy;
          const count = group.querySelector('.lSQKOG_count'); count.hidden = false; count.textContent = String(i + 1);
        });
        t += 1300;
      });
      at(t, () => {
        const label = group.querySelector('.lSQKOG_label');
        label.textContent = SUMMARY; label.dataset.loading = 'false';
      });
      t += 450;
      let msg; let ul; let cur;
      at(t, () => { msg = add('<div class="dSRCBG_message"></div>'); });
      ANSWER.forEach(([parent, tag, text]) => {
        at(t += 30, () => {
          cur = document.createElement(tag);
          (parent === 'ul' ? ul : msg).appendChild(cur); if (tag === 'ul') ul = cur;
        });
        text.split(' ').filter(Boolean).forEach((word, n) => {
          at(t += 45, () => { cur.textContent += (n ? ' ' : '') + word; });
        });
      });
      t += 4500;
      at(t, () => root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }));
      at(t + 600, play);
    };

    if (reduced) { final(); return undefined; }
    final(); // something sensible before the card is first seen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!playing) play(); } else if (playing) { stop(); root.getAnimations().forEach((a) => a.cancel()); final(); }
    }, { threshold: 0.35 });
    io.observe(root);
    return () => { io.disconnect(); stop(); };
  }, [ref]);
}
