import { useEffect } from 'react';

// Raycast AI bento: the chat window is laid out at a fixed design width (inline `width: 972px`) and scaled
// to its card with `--window-scale`, which the original computes in JS from the card's width.
export default function useWindowScale(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof ResizeObserver === 'undefined') return undefined;
    const visuals = [...root.querySelectorAll('[style*="--window-scale"]')];
    const ro = new ResizeObserver((entries) => entries.forEach(({ target }) => {
      const win = target.querySelector('[style*="width"]');
      const design = (win && parseFloat(win.style.width)) || 972;
      target.style.setProperty('--window-scale', String(target.getBoundingClientRect().width / design));
    }));
    visuals.forEach((v) => ro.observe(v));
    return () => ro.disconnect();
  }, [ref]);
}
