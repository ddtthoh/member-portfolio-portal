Bring back the aurora + grid background, but stop it from causing scroll lag.

The original lag came from the background painting on scroll: `.aurora-bg::before` and `.grid-floor::after` are absolutely positioned at the height of the whole scrolling page, so every scroll forces the browser to recomposite a giant blurred (60px blur) layer.

## Fix

1. **Restore the background classes** on the portal shell wrapper (`aurora-bg grid-floor`).

2. **Make the background fixed to the viewport, not the page**:
   - Change `.aurora-bg::before` from `position: absolute; inset: -20%` to `position: fixed; inset: 0` so it only covers the visible area and never repaints during scroll.
   - Same change for `.dark .grid-floor::after`.
   - Keep all visuals (gold/blue/purple radial gradients, blur, grid lines, mask).

3. **Promote the layers to their own GPU layer** with `will-change: transform; transform: translateZ(0)` so the compositor doesn't re-rasterize them.

4. **Keep the previous performance fixes intact** (no animated counters, no sparkline draw-in animation, no per-card motion fade-ins, no SVG noise overlays, no tilt parallax). Only the visual background returns.

5. **Verify** by re-profiling the first scroll on `/portal` — confirm no large paint/composite spikes.