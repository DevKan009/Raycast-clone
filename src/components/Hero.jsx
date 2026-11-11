import React, { useState, useEffect, useRef } from 'react';
import { WindowsIcon } from './Icons';

const CMD = 'winget install Raycast.Raycast';

export default function Hero() {
  const [pop, setPop] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!pop) return;
    const close = (e) => { if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setPop(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [pop]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(CMD); } catch { /* clipboard unavailable */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="hero">
      <div className="hero-text fade-in-up">
        <h1>Your shortcut to everything.</h1>
        <p className="fade-in-up-stagger"><span>A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable.</span></p>
      </div>
      <div className="hero-cta">
        <div className="hero-cta-buttons">
          <a className="btn btn-light" href="https://www.raycast.com/download/windows"><WindowsIcon />Download for Windows</a>
        </div>
        <p className="hero-req">Windows 10+ (x64 or ARM64)</p>
        <div className="hero-sub" ref={ref}>
          <button type="button" aria-haspopup="dialog" aria-expanded={pop} onClick={() => setPop(!pop)}>Install via WinGet</button>
          {pop && (
            <div className="winget-pop" role="dialog" aria-label="Install via WinGet">
              <code>{CMD}</code>
              <button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
            </div>
          )}
        </div>
      </div>
      <div className="hero-announce">
        <div className="announce-outer">
          <a className="announce" href="https://www.raycast.com/keyboard">
            The Raycast Keyboard
            <span className="muted">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8h10m0 0L9 4m4 4-4 4" /></svg>
            </span>
          </a>
        </div>
      </div>
      <div className="hero-bg"><img src="/assets/hero_pure_3d.png" alt="" /></div>
    </div>
  );
}
