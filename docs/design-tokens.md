# Design tokens (measured from live computed styles / the site's own CSS)

All values below were read from the reference stylesheets (`reference/css`, loaded unmodified as `src/styles/ref`) or `getComputedStyle`, i.e. **measured**, unless marked *(estimate)*.

## Colour
grey-50 `#e6e6e6` · 100 `#cdcece` · 200 `#9c9c9d` · 300 `#6a6b6c` · 400 `#434345` · 500 `#2f3031` · 600 `#1b1c1e` · 700 `#111214` · 800 `#0c0d0f` · 900 `#07080a` (page background) · red `#ff6363` · blue `#56c2ff`.
Card border `#ffffff0f`; card bg `linear-gradient(137deg,#111214 4.87%,#0c0d0f 75.88%)`.

## Typography
- Body/UI: **Inter** variable, 14px/500 nav + buttons, letter-spacing .2px.
- Mono: **Geist Mono** 12px / line-height 160% (hero requirements, WinGet link).
- Hero H1: 36px (<420) → 48px (≥420) → 64px/600, line-height 70.4px (110%), max-width 540px; subtitle 14px → 18px, centred, `text-wrap:balance`.
- Section titles use the site's `sectionTitle` styles (carried in `style_*.css`).

## Spacing / radii / widths
Spacing scale 4,8,12,16,20,24,32,40,48,56,64,80,96,112,168,224px. Radii 4/6/8/12/16/20/24px. Containers 1204 (default), 1280, 1064, 746px.
Hero: text padding 260/137 → 370/212 (≥720), margin-bottom 96 → 224px; hero height 967px at ≥720.

## Navbar
Fixed, padding 16px top; pill max-width 1204, height 58 (<880) / 76 (≥880), padding 16/32, radius 16, 1px border `#ffffff0f`, `backdrop-filter: blur(5px)`, inner highlight `inset 0 1px 1px #ffffff26`. Links 12×8 padding, 6px radius, colour grey-200 → white on hover.

## Buttons (light)
min-height 36, padding 8×12, radius 8, bg grey-50, text grey-500, shadow `0 0 0 2px #00000080, 0 0 14px #ffffff30, inset 0 -1px .4px #0003, inset 0 1px .4px #fff`; hover bg white; active grey-100 + scale .98.

## Motion
Hero fade-in-up 1s (subtitle delayed 1s); announcement pill conic border ~3.2s loop *(estimate)*; dock/pill transitions .2–.3s; feature wall 5s auto-advance (progress bar CSS animation); extension highlight `transform .3s, width .3s`.

## Layout checkpoints (1440px, measured)
Section tops: 1191, 2566, 3286, 4724, 6292, 7392, 8535, 9521, 10317, 13499, 14743; page height 15983. Extension cards 360px wide, 56px gap.
