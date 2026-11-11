import { useEffect } from 'react';

// The four "feature" keycaps (the ones carrying copy instead of a letter) light up from 0.2 to full
// opacity when the keyboard scrolls into view, staggered in reading order of importance:
// Personal → Fast → Reliable → Ergonomic. They dim again once the keyboard leaves the viewport.
// The fade itself is the `transition: opacity .4s` already on .h8MSgW_key.
const ORDER = ['Personal.', 'Fast.', 'Reliable.', 'Ergonomic.'];
const STEP = 0.3; // seconds between keys

export function useKeyboard(ref) {
  useEffect(() => {
    const kb = ref.current && ref.current.querySelector('.h8MSgW_keyboard');
    if (!kb) return undefined;
    const keys = [...kb.querySelectorAll('.h8MSgW_key')]
      .map((el) => ({ el, i: ORDER.indexOf((el.querySelector('strong') || {}).textContent) }))
      .filter((k) => k.i >= 0);
    if (!keys.length) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const set = (on) => keys.forEach(({ el, i }) => {
      el.style.transitionDelay = on && !reduced ? `${i * STEP}s` : '0s';
      el.style.opacity = on ? '1' : '0.2';
    });

    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold: 0.5 });
    io.observe(kb);
    return () => io.disconnect();
  }, [ref]);
}

export default useKeyboard;
