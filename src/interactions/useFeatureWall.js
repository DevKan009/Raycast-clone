import { useEffect } from 'react';
import createReplay from './replay';

// "What else can Raycast do?" wall: each sentence has its own live mock-up panel. The panels are replayed
// from /features.json (one 5s segment per sentence, advancing automatically); clicking or pressing Enter
// on a sentence jumps to its panel.
export default function useFeatureWall(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const pick = (target, segs) => {
      const text = target.closest && target.closest('[class*=_wall] [class*=_text][role=button]');
      return text ? segs.findIndex((s) => s.a === text.textContent.trim()) : -1;
    };
    // The mock-up stage is designed at 633px and zoomed to its column with --stage-zoom (JS-computed in the original).
    const zoom = () => {
      const st = root.querySelector('[class*=_stage]');
      const wrap = st && st.parentElement;
      if (!wrap) return null;
      const cs = getComputedStyle(wrap);
      return ((wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / 633).toFixed(3);
    };
    const transform = (h) => { const z = zoom(); return z ? h.replace(/--stage-zoom: ?[\d.]+/g, `--stage-zoom: ${z}`) : h; };
    const replay = createReplay(root, '/features.json', { pick, transform });
    const stage = root.querySelector('[class*=_stage]');
    if (stage && zoom()) stage.style.setProperty('--stage-zoom', zoom());
    window.addEventListener('resize', replay.refresh);
    return () => { window.removeEventListener('resize', replay.refresh); replay(); };
  }, [ref]);
}
