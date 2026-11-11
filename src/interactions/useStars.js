import { useEffect } from 'react';

const STATES = ['off', 'off', 'medium', 'high'];

// Twinkling star field behind the macOS frame: randomly flips a few stars' data-state
// (CSS transitions do the fade) and occasionally respawns one at a new position.
export function useStars(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const stars = [...root.querySelectorAll('[data-state]')];
    if (!stars.length) return undefined;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);
    const timer = setInterval(() => {
      if (!visible) return;
      for (let i = 0; i < 3; i += 1) {
        const s = stars[Math.floor(Math.random() * stars.length)];
        s.dataset.state = STATES[Math.floor(Math.random() * STATES.length)];
      }
    }, 160);
    return () => { clearInterval(timer); io.disconnect(); };
  }, [ref]);
}

export default useStars;
