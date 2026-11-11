import { useEffect } from 'react';

// Extensions carousel: category pills switch the card set (4 pre-rendered sets), the pill backdrop slides
// to the active label, and previous/next buttons scroll the snap-scrolling reel by one card.
export default function useExtensions(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const cats = [...root.querySelectorAll('[class*=_category]')].filter((c) => !/Container|categories/.test(c.className));
    const backdrop = root.querySelector('[class*=activeBackdrop]');
    const scroller = root.querySelector('[class*=_reelContainer]');
    const sets = [...root.querySelectorAll('[data-cat]')];
    const prev = root.querySelector('[class*=_previous]');
    const next = root.querySelector('[class*=_next]');
    if (!cats.length || !scroller) return undefined;
    const activeCls = (cats.find((c) => c.className.includes('_active')) || cats[0]).className.split(' ').find((c) => c.endsWith('_active'));
    let cur = 0;

    const place = () => {
      const link = cats[cur].querySelector('a') || cats[cur];
      const l = link.getBoundingClientRect(); const p = cats[0].parentElement.getBoundingClientRect();
      backdrop.style.setProperty('--width', `${Math.round(l.width + 24)}px`);
      backdrop.style.setProperty('--offset', `${Math.round(l.left - p.left - 12)}px`);
    };
    const updateArrows = () => {
      if (prev) prev.disabled = scroller.scrollLeft <= 4;
      if (next) next.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4;
    };
    const choose = (i) => {
      cur = i;
      cats.forEach((c, n) => c.classList.toggle(activeCls, n === i));
      sets.forEach((s) => { s.hidden = Number(s.dataset.cat) !== i; });
      scroller.scrollTo({ left: 0, behavior: 'auto' });
      place(); updateArrows();
    };
    const step = () => { const card = scroller.querySelector('[class*=extensionCardWrapper]'); return card ? card.getBoundingClientRect().width + 56 : 416; };
    const onPrev = () => scroller.scrollBy({ left: -step(), behavior: 'smooth' });
    const onNext = () => scroller.scrollBy({ left: step(), behavior: 'smooth' });
    const cleanups = cats.map((c, i) => {
      const a = c.querySelector('a') || c;
      const h = (e) => { e.preventDefault(); choose(i); };
      const k = (e) => { if (e.key === 'Enter' || e.key === ' ') h(e); };
      a.setAttribute('role', 'tab'); a.setAttribute('tabindex', '0');
      a.addEventListener('click', h); a.addEventListener('keydown', k);
      return () => { a.removeEventListener('click', h); a.removeEventListener('keydown', k); };
    });
    if (prev) prev.addEventListener('click', onPrev);
    if (next) next.addEventListener('click', onNext);
    scroller.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', place);
    place(); updateArrows();
    return () => {
      cleanups.forEach((f) => f());
      if (prev) prev.removeEventListener('click', onPrev);
      if (next) next.removeEventListener('click', onNext);
      scroller.removeEventListener('scroll', updateArrows); window.removeEventListener('resize', place);
    };
  }, [ref]);
}
