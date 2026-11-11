import { useEffect } from 'react';

// YouTube strip: a draggable horizontal carousel (translate3d on the embla container), like the original.
export default function useCommunityCarousel(ref) {
  useEffect(() => {
    const root = ref.current;
    const track = root && root.querySelector('[class*=embla] > [class*=container]');
    if (!track) return undefined;
    const viewport = track.parentElement;
    const m = track.style.transform.match(/translate3d\((-?[\d.]+)px/);
    let x = m ? parseFloat(m[1]) : 0;
    const MAX = 460;
    const minX = () => { const last = track.lastElementChild; return Math.min(0, viewport.clientWidth - (last.offsetLeft + last.offsetWidth) - 24); };
    let start = null; let moved = false;
    const apply = (v) => { x = Math.max(minX(), Math.min(MAX, v)); track.style.transform = `translate3d(${x}px, 0px, 0px)`; };
    const down = (e) => { start = { px: e.clientX, x }; moved = false; };
    const move = (e) => { if (!start) return; const dx = e.clientX - start.px; if (Math.abs(dx) > 4) moved = true; if (moved) apply(start.x + dx); };
    const up = () => { start = null; };
    const click = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const wheel = (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); apply(x - e.deltaX); } };
    viewport.style.touchAction = 'pan-y'; viewport.style.cursor = 'grab';
    track.style.transition = 'transform .25s ease-out';
    viewport.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    viewport.addEventListener('click', click, true); viewport.addEventListener('wheel', wheel, { passive: false });
    return () => {
      viewport.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      viewport.removeEventListener('click', click, true); viewport.removeEventListener('wheel', wheel);
    };
  }, [ref]);
}
