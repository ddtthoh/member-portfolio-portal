## Changes to `src/routes/portal.staking-plans.tsx` (Your Position card only)

### 1. Remove "Principal" subline
- Drop the `Principal` / `No active stake` text under the staking amount column. Column becomes: eyebrow → amount only (cleaner, matches the other two columns visually since they keep their sublines).

### 2. Eye-toggle masking (default = visible)
- Add `showAmount` state (default `true`), mirroring the pattern from `staking-overview-card.tsx`.
- Eye / EyeOff button positioned top-right of the card (next to the existing "Active" pill, or absolute top-right corner — top-right corner is cleaner so the Active pill stays beside the "Your Position" label).
- When hidden:
  - Staking amount → `••••••`
  - Tier name → kept visible (it's not sensitive)
  - Monthly ROI value → `••••`
  - Started Since date + days → kept visible
- Only sensitive numerics get masked; tier/date stay so the card still feels alive.

### 3. Premium glow sweep
- A diagonal/horizontal light streak overlay that animates left → right across the card.
- Sequence: on mount, plays **3 consecutive sweeps** (~1.6s each, ~0.2s gap), then repeats the same 3-sweep burst **every 10 seconds**.
- Implementation: an absolutely-positioned `<div>` inside the card with a linear-gradient (`transparent → gold/25 → transparent`) and a CSS keyframe `translateX(-120%) → translateX(120%)`. Driven by a React state `sweepKey` that increments to retrigger the animation; a `setInterval` of 10s + initial burst loop kicks 3 sweeps each cycle.
- Animation respects `overflow-hidden` already on the card. No layout shift.
- Add the keyframe inline via a `<style>` tag or extend `src/styles.css` with a `@keyframes position-sweep` + `.animate-position-sweep` utility (preferred for clean separation).

### Out of scope
- No changes to the Start Staking CTA, tier sections, or other pages.
- No changes to wallet data or business logic.