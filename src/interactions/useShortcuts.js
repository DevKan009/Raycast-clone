import { useEffect } from 'react';
import { useStars } from './useStars';
import createReplay from './replay';

// "Take shortcuts, not detours" showcase: five scripted demos (clipboard search, AI answer, emoji picker,
// calculator, window management) replayed from /showcase.json, one segment per dock item. Clicking a dock
// icon jumps to that demo; the reel slides to the matching window.
export default function useShortcuts(ref) {
  useStars(ref);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    let current = 0;
    const scrollReel = (i, smooth) => {
      current = i;
      const reel = root.querySelector('[class*=showcaseReel]');
      if (reel) reel.scrollTo({ left: i * reel.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    };
    const pick = (target, segs) => {
      const item = target.closest && target.closest('[class*=_dock] [class*=_item]');
      if (!item) return -1;
      const i = [...item.parentElement.querySelectorAll('[class*=_item]')].indexOf(item);
      return segs.findIndex((s) => s.a === i);
    };
    const onResize = () => scrollReel(current, false);
    window.addEventListener('resize', onResize);
    const cleanup = createReplay(root, '/showcase.json', { pick, onSegment: scrollReel});
    return () => { window.removeEventListener('resize', onResize); cleanup(); };
  }, [ref]);
}
