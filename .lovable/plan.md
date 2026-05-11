
## Goal

Roll back the size/shell change on the 5 promotion tracking boxes (2 NASLAB + 3 RCB/TCB/Community Ranking) so they look exactly as before — same `SpotlightCard` with `gold-aura` shell, same dimensions. Then add **only** the diagonal "sweep" glow animation that runs on the Your Position card on the staking-plans page.

## What was wrong

The previous step replaced `SpotlightCard` with a new `GlowFrame` component. `GlowFrame` brought along its own conic ring, drop shadow, corner radial glows, and inner padding wrapper. That changed the visible card size and visual weight of the 5 tracking boxes — which the user does not want. They only wanted the animated diagonal sweep, not a new shell.

## Changes

### 1. `src/routes/portal.promotion.$promoId.tsx`

**`TrackCard`** (NASLAB qualification, currently uses `<GlowFrame innerClassName="liquid-glass p-6">` at line 358):

- Restore the original wrapper:
  ```tsx
  <SpotlightCard className="liquid-glass gold-aura rounded-2xl p-6">
  ```
- Inside, add ONE extra child at the top: the always-mounted diagonal sweep overlay (copied verbatim from `portal.staking-plans.tsx` lines 136–148), driven by a local `sweepRunning` state initialized via `useEffect` + `requestAnimationFrame` (same pattern as the staking page).
- Remove the existing inner radial-gradient overlay block at lines 359–367 only if it was added together with `GlowFrame`. Verify against the pre-change shape; if that overlay was already part of the original card before the GlowFrame migration, keep it. (Current evidence suggests it was added with GlowFrame — it will be removed.)
- Keep all other inner JSX (eyebrow row, title, metrics, progress bar, reward grid) byte-identical.

**`RankingTrackCard`** (RCB / TCB / Community Ranking, currently uses `<GlowFrame innerClassName="liquid-glass p-6">` at line 1235):

- Same treatment: restore `<SpotlightCard className="liquid-glass gold-aura rounded-2xl p-6">`, drop the GlowFrame-era inner radial overlay (lines 1236–1243), insert the same sweep overlay div at the top, keep all other content unchanged.
- Add the same `sweepRunning` state + mount effect inside this component.

**Imports:**

- Remove `import { GlowFrame } from "@/components/glow-frame";`
- Add `import { useEffect, useState } from "react";` if not already present.

### 2. `src/components/glow-frame.tsx`

- No longer used. Delete the file.

### 3. `src/styles.css`

- No changes. The `@keyframes position-sweep-move` / `position-sweep-fade` and `.animate-position-sweep` class already exist and are reused as-is.

### 4. `src/routes/portal.staking-plans.tsx`

- No changes. Your Position card stays exactly as it is.

## Sweep overlay snippet (reused in both card components)

```tsx
const [sweepRunning, setSweepRunning] = useState(false);
useEffect(() => {
  const id = requestAnimationFrame(() => setSweepRunning(true));
  return () => cancelAnimationFrame(id);
}, []);

// ...inside the SpotlightCard, as the FIRST child:
<div
  aria-hidden
  className={`pointer-events-none absolute -inset-[15%] ${sweepRunning ? "animate-position-sweep" : ""}`}
  style={{
    background:
      "linear-gradient(135deg, transparent 30%, color-mix(in oklab, var(--gold) 35%, transparent) 50%, transparent 70%)",
    mixBlendMode: "screen",
    opacity: 0,
    willChange: "transform, opacity",
    transform: "translate3d(-60%, -60%, 0)",
  }}
  onAnimationEnd={() => setSweepRunning(false)}
/>
```

`SpotlightCard` already establishes a positioned, overflow-clipped container, so the absolutely-positioned sweep clips correctly to the card's rounded rectangle — same behavior as on the Your Position card.

## Result

- 5 tracking boxes return to their exact previous size and visual shell (SpotlightCard + gold-aura).
- Each box plays the same one-shot diagonal gold sweep on mount that the Your Position card uses — nothing else added.
