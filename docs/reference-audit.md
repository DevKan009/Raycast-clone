# Reference audit — https://www.raycast.com/ (inspected 2026-11-09)

Inspected live in Chrome via Playwright (`scripts/qa_*.cjs`). The live page serves the **Windows** variant of the homepage
(Windows download buttons, WinGet install). The site is Next.js with CSS modules and Inter / Geist Mono web fonts.

## Section inventory (page order, desktop 1440px; total height 15983px)

| # | Section (heading) | Top → height | Notes |
|---|---|---|---|
| 0 | Floating navbar | fixed, 92px | Pill container, blur, 9 links, Log in + Download |
| 1 | Hero — "Your shortcut to everything." | 0 → 967 | WebGL tube background (canvas), Download for Windows, WinGet popover, "The Raycast Keyboard" animated-border pill |
| 2 | "Take shortcuts, not detours." | 1191 → 1375 | macOS frame + star field, 5 command windows in a horizontal reel, dock |
| 3 | "It's not about saving time." | 2566 → 720 | Mechanical keycap rows |
| 4 | "There's an extension for that." | 3286 → 1257 | Category pills, snap-scrolling extension cards, prev/next |
| 5 | "Meet your new virtual assistant" | 4724 → 1389 | Raycast AI bento (chat window, AI commands, prompts) |
| 6 | "Built for professionals like you." | 6292 → 1100 | Testimonial/profile wall |
| 7 | "Don't repeat yourself." | 7392 → 1143 | Snippets / Quicklinks / hotkey cards |
| 8 | "What else can Raycast do?" (feature wall) | 8535 → 986 | 12 rotating sentences + image panel + progress bar |
| 9 | "Stay in the loop." | 9521 → 795 | Slack / X cards, YouTube carousel |
| 10 | "Build the perfect tools." | 10317 → 3182 | Developer platform: illustrations, code, store publishing |
| 11 | "Take the short way." | 13499 → 1244 | Final download CTA |
| 12 | Footer | 14743 → 1239 | 6 link columns, newsletter form, legal |

Section order/height at 768px (16661px total) and 390px (15948px total) were measured the same way; the local page matches all three exactly.

## Observed interactions
- **Navbar**: ≥880px pill with inline links; <880px collapses to logo + animated hamburger that expands the pill (full-height menu, Log in button). ≥1064px full wordmark + Download button.
- **Hero**: staggered fade-in-up of headline/subtitle; "Install via WinGet" opens a dialog popover; announcement pill has a rotating conic border.
- **Section 2**: dock click → reel scrolls to `index × reelWidth`; tooltip names Clipboard History / AI / Emoji Picker / Calculator / Window Management and follows the icon; reel auto-advances (~6s); stars twinkle randomly; <720px the reel is screenshots instead of live DOM.
- **Section 4**: category pills swap the card set (Productivity 17 cards, Engineering 8, Design 7, Writing 8) and slide the highlight; arrows scroll one card (416px) via scroll-snap; Linear/Translate/Spotify cards have CSS animations.
- **Section 8**: sentences are `role=button`; click or 5s timer swaps active sentence, image, badge, subtitle (+ "Learn more" for Notes/Focus); progress bar restarts.
- **Section 9**: YouTube strip is a draggable carousel (translate3d).
- **Footer**: newsletter form (random placeholder/submit label per load on the live site).
- Hover/focus states are CSS-only and carried over with the original stylesheets.

## Screenshots (this repo)
Reference captures: `reference/raycast_*` (desktop 1440, tablet 768, mobile 390, full page, 2×/3× DPR) and live section slices from `scripts/qa_slices.cjs`.
Local captures: `docs/screenshots/{desktop,large,tablet,mobile}_{fold,full}.png` (1440×900, 1920×1080, 768×1024, 390×844) and `interaction_*.png`.

## Assets
Images, videos' poster frames and SVG art were downloaded from the public site by `scripts/html_to_jsx.cjs` into `public/img` (cache: `reference/img_cache.json`).
Fonts (Inter variable, Geist Mono, JetBrains Mono, Instrument Serif) and CSS background images are in `public/media`. Hero background is a still render of the WebGL scene (`public/assets/hero_pure_3d.png`).

## Responsive observations
Breakpoints used by the original: 420, 480, 720, 768, 880, 920, 1024, 1064, 1204. Notable: hero H1 36→48→64px; navbar collapses <880; showcase reel DOM vs screenshots at 720; extension reel padding/mask at 720.

## Not inspected / limitations
- The hero WebGL canvas (three.js) animation is not reproduced; a static render fades in instead (visible difference during the first seconds only).
- Exact easing of some JS-driven motion (star respawn, carousel inertia) is approximated.
- Autoplay/video content: none found on the homepage; YouTube thumbnails link out.
- Behaviour behind sign-in or on other routes was not inspected.

## Update 2026-11-11 — scripted demos
The live site was redeployed after the first audit (new stylesheets; page height now 16008 / 16734 / 15997px at 1440 / 768 / 390). Re-inspected and re-synced:
- **Showcase ("Take shortcuts")** is now five scripted demos on a loop (~40s): clipboard search typing "magic at your fingertips" and copying, Quick AI answering "which note taking apps support markdown?", emoji search "point", calculator "12pm here in london", and window-management layouts. One cycle was recorded from the live DOM (`scripts/record_replay.cjs showcase` -> `public/showcase.json`) and is replayed by `src/interactions/replay.js`; dock icons jump to a demo. The same DOM is used below 790px (CSS `zoom: .6`), so the earlier screenshot fallback is gone.
- **Feature wall** now shows a live mock-up per sentence (11 sentences, 5s each, random order on the live site). Each panel was captured by clicking its sentence (`record_replay.cjs features` -> `public/features.json`); the clone advances in sentence order.
- **JS-computed scales**: `--window-scale` (AI bento chat window, card width / 972) and `--stage-zoom` (feature stage, column width / 633) are recomputed on resize.
- Not reproduced: hover-following dock tooltip, the live site's random feature order, and timing variations between cycles (the replay repeats one recorded cycle).
