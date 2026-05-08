# Fix scroll lag in the portal

Goal: remove the always-running visual effects causing scroll jank on phone, tablet, and desktop, while keeping the portal's gold/glass aesthetic.

## What gets removed (all viewports)

In `src/components/portal-shell.tsx`:

1. **`<ThreeBackground />`** + its wrapper div (lines ~175–177) — the WebGL render loop is the largest GPU/CPU cost.
2. **`<CursorGlow />`** (line 166) — full-screen mouse-tracked radial gradient that repaints on every mousemove.
3. **`backdrop-blur-md`** on the sidebar (line 202) → keep `bg-sidebar/80`, drop the blur.
4. **`backdrop-blur`** on the sticky top header (line 301) → keep translucent bg, drop the blur.
5. **`backdrop-blur-sm`** on the mobile overlay (line 196) → keep dim, drop the blur.

## What stays (visual identity preserved)

- `aurora-bg`, `grid-floor`, the gold gradient line, and the SVG noise overlay (all static, cheap).
- `SpotlightCard` hover spotlight on cards (only animates on hover, not on scroll).
- All gold accents, borders, shadows, and typography.

## Why this fixes the lag

Stacked `backdrop-blur` layers force the browser to re-rasterize blurred regions on every scroll frame, and the Three.js canvas runs a continuous render loop on top. Together they saturate the main thread during fast scrolls. Removing them returns scrolling to native 60fps with no visible loss in the portal's premium look — the aurora gradient + grid floor + noise already carry the atmosphere.

## Files touched

- `src/components/portal-shell.tsx` — only file edited.
- `ThreeBackground` and `CursorGlow` component files stay in the repo (unused, no harm) so they can be re-enabled later if desired.
