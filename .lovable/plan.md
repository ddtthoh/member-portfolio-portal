The "lightning nodes" is the gold 3D node web from `src/components/three-background.tsx` (`<ThreeBackground />`). It got removed during the scroll-lag cleanup and is no longer mounted anywhere. I'll bring it back, but pin it to the viewport (not the scrolling page) so it does not cost paint on scroll.

## Changes

1. **Mount `ThreeBackground` once at the portal shell level**
   - In `src/components/portal-shell.tsx`, add `<ThreeBackground />` inside the `aurora-bg grid-floor` wrapper, behind the content (`-z-10`).
   - Use `position: fixed; inset: 0` so the canvas covers only the viewport and is not part of the scrolling layer (no repaint on scroll).
   - Keep `pointer-events-none` so it never blocks UI.

2. **Adjust `ThreeBackground` for a fixed full-viewport layer**
   - Add an optional `fixed` prop (default true when used as portal background) that swaps the wrapper from `absolute … h-[520px]` to `fixed inset-0 h-screen w-screen`.
   - Apply a softer top→bottom mask so it still fades into content and doesn't compete with cards.
   - Keep `frameloop="always"` only when interactive; switch to `frameloop="demand"` when `prefers-reduced-motion` is set.

3. **Keep it cheap on the first scroll**
   - Lower default node count slightly on phone/tablet (already tier-aware) and clamp DPR to `[1, 1.25]` on phones to avoid the initial GPU spike that caused the "first scroll stuck" issue.
   - Disable pointer-based mouse repulsion on coarse pointers (already done) — no change needed.
   - Do NOT animate any opacity/translate on mount (no framer-motion wrapper).

4. **Leave the rest of the perf fixes intact**
   - Aurora + grid background stays `position: fixed`.
   - No counters, sparkline draw-in, tilt parallax, or per-card motion fade-ins are re-enabled.

## Verification
- Reload `/portal`, confirm the gold node web + lightning packets are visible behind the content.
- Scroll immediately on first load — confirm no stutter (the canvas is fixed to viewport, so scroll does not trigger canvas repaint of a tall layer).
