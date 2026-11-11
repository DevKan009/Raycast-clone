import React, { useState, useEffect } from 'react';
import { RaycastLogo, RaycastWordmark, WindowsIcon } from './Icons';

const BASE = 'https://www.raycast.com';
export const navLinks = [
  ['Store', '/store'], ['Pro', '/pro'], ['AI', '/core-features/ai'], ['iOS', '/ios'], ['Windows', '/windows'],
  ['Teams', '/teams'], ['Enterprise', '/enterprise'], ['Blog', '/blog'], ['Pricing', '/pricing'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu when growing to desktop width or pressing Escape.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 880 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className={`nav-container ${open ? 'open' : ''}`} id="navbar">
      <header className={`navbar ${open ? 'open' : ''}`}>
        <div className="nav-logo-row">
          <a href="/" aria-label="Raycast home">
            <RaycastLogo className="nav-logo" />
            <RaycastWordmark className="nav-logo-full" />
          </a>
          <button type="button" className={`nav-toggle ${open ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
        <nav className="nav-links" aria-label="Main">
          {navLinks.map(([label, href]) => (
            <a key={label} className="nav-link" href={BASE + href}>{label}</a>
          ))}
        </nav>
        <div className="nav-secondary">
          <div className="nav-wide">
            <a className="nav-link" href={BASE + '/users/sign_in'}>Log in</a>
            <a className="btn btn-light" href={BASE + '/download/windows'}><WindowsIcon />Download</a>
          </div>
          <div className="nav-medium">
            <a className="btn btn-light" href={BASE + '/users/sign_in'}>Log in</a>
          </div>
        </div>
      </header>
    </div>
  );
}
