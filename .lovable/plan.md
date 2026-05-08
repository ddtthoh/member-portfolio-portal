## Goal
Bring the gold node web back to full crispness on phone and desktop without re-introducing the first-scroll stutter.

## Why it looks low-res now
In `src/components/three-background.tsx`, the `<Canvas>` is currently rendered at `dpr={[1, 1]}` on phones and `[1, 1.25]` on tablet/desktop, with `antialias` disabled below 640px. On a Retina display (devicePixelRatio 2) this means the canvas is drawn at roughly half resolution, then upscaled — that's the blur on nodes and lines.

## Changes (single file: `src/components/three-background.tsx`)

1. **Raise DPR caps to native, with a sane ceiling**
   - Phone: `dpr={[1, 2]}`
   - Tablet/Desktop: `dpr={[1, 2]}` (cap at 2 even on 3x screens — diminishing returns, big GPU cost)
   - When `prefers-reduced-motion` is set, keep `[1, 1.5]` to stay extra cheap.

2. **Re-enable antialiasing everywhere**
   - `antialias: true` on all viewports. With sprite-based points + lines, MSAA cost is small and edges stop looking jagged.

3. **Keep scroll smooth — counter the extra GPU load**
   - The canvas is already `position: fixed` (no scroll repaint), so resolution itself doesn't cause scroll jank.
   - To offset the higher pixel count, slightly lower node counts only on phone: `phone: 28` (was 32). Tablet/desktop unchanged.
   - Keep `powerPreference: "high-performance"` on tablet/desktop, `"low-power"` on phone.
   - Keep `frameloop="demand"` when reduced-motion is on.

4. **No other changes**
   - Do not touch `portal-shell.tsx`, aurora/grid layers, counters, sparkline, tilt, or per-card motion.
   - No new dependencies.

## Verification
- Reload `/portal` on desktop preview: nodes and connecting lines look sharp, not soft.
- Switch preview to mobile (390px): same crispness, no first-scroll stutter when scrolling immediately after load.
- If reduced-motion is enabled in OS, canvas still renders crisply but does not animate continuously.
