import { useEffect } from 'react';

const CMD = 'winget install Raycast.Raycast';

// "Install via WinGet" trigger in the bottom call-to-action: toggles a small popover with the
// install command and a copy button (closes on outside click / Escape).
export default function useWinget(ref) {
  useEffect(() => {
    const root = ref.current;
    const trigger = root && root.querySelector('button[aria-haspopup=dialog]');
    if (!trigger) return undefined;
    const host = trigger.parentElement; host.style.position = 'relative';
    let pop = null;
    const close = () => { if (pop) { pop.remove(); pop = null; trigger.setAttribute('aria-expanded', 'false'); trigger.dataset.state = 'closed'; } };
    const open = () => {
      pop = document.createElement('div');
      pop.setAttribute('role', 'dialog');
      pop.style.cssText = 'position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);z-index:5;width:max-content;max-width:92vw;background:#111214;border:1px solid #ffffff1a;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 12px 40px #000a;color:#fff;font-size:13px';
      const code = document.createElement('code'); code.textContent = CMD;
      const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Copy';
      btn.style.cssText = 'color:#9c9c9d;border:1px solid #ffffff1a;border-radius:6px;padding:2px 8px;cursor:pointer;background:none;font:inherit';
      btn.onclick = async () => { try { await navigator.clipboard.writeText(CMD); } catch { /* clipboard unavailable */ } btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); };
      pop.append(code, btn); host.appendChild(pop);
      trigger.setAttribute('aria-expanded', 'true'); trigger.dataset.state = 'open';
    };
    const toggle = () => (pop ? close() : open());
    const outside = (e) => { if (pop && !host.contains(e.target)) close(); };
    const esc = (e) => { if (e.key === 'Escape') close(); };
    trigger.addEventListener('click', toggle); document.addEventListener('mousedown', outside); document.addEventListener('keydown', esc);
    return () => { close(); trigger.removeEventListener('click', toggle); document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', esc); };
  }, [ref]);
}
