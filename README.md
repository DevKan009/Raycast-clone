# Raycast homepage recreation (Phase 1)

React + Vite (JavaScript). Run: `npm install && npm run dev` (http://localhost:5174) · build: `npm run build` · preview: `npm run preview`.

- `src/components` — Navbar, Hero (hand-written)
- `src/sections` — homepage sections generated from DOM snapshots (`scripts/html_to_jsx.cjs`), styled by the site's original CSS in `src/styles/ref`
- `src/interactions` — behaviour hooks (recorded-demo replay for the showcase and feature wall, extension carousel, YouTube strip, stars, window scale, WinGet popover, newsletter)
- `public/showcase.json`, `public/features.json` — recorded demo scripts; re-record with `node scripts/record_replay.cjs showcase|features`
- `docs/` — reference audit, design tokens, screenshots · `scripts/qa_*.cjs` — visual QA tooling (Playwright)
