## Goal
Refine the half-circle Total Assets gauge so the three asset segments (Participation / Cash / Earnings) are visually distinct, with a polished institutional feel matching the user's reference image.

## Approach: Option A — Refined Half-Donut, 3 distinct hues

### 1. `src/styles.css` — add asset color tokens
Add three semantic tokens in both `:root` (light) and `.dark` blocks:
- `--asset-participation` — gold (matches existing brand)
- `--asset-cash` — teal/cyan
- `--asset-earnings` — soft violet

Tokens defined in `oklch` for both themes so contrast stays correct.

### 2. Rewrite `src/components/total-assets-gauge.tsx`
- Use `pathLength={1}` on each `<path>` so dash math is normalized 0–1.
- Render 3 stacked segments on the same half-circle arc using `strokeDasharray` + cumulative `strokeDashoffset`, with a small ~0.008 gap between segments so they read as distinct slices (not one continuous ring).
- Each segment gets:
  - Its own color token (`hsl(var(--asset-*))` via inline `style.stroke`)
  - A matching `filter: drop-shadow(...)` for subtle glow
  - `strokeLinecap="round"`
- Track ring stays as faint `hsl(var(--accent)/0.25)` underneath.
- Animate each segment's dash length via framer-motion `animate()`, staggered (0s, 0.25s, 0.5s) — keep current entrance feel.
- Center label: small uppercase `Total Assets · USD` + large gold `$X,XXX.XX` (CountUp).
- Legend grid (3 cols below): colored dot + label (Participation / Cash / Earnings) + percentage value tinted to match its segment color (not all gold).

### 3. No DB / route changes
Component is already wired into `/portal` and `/portal/asset-analysis` via `useWallet()`. Wording (Cash / Earnings) already updated in prior turn.

## Result
Clean half-donut where Participation (gold), Cash (teal), Earnings (violet) are instantly distinguishable, each with a soft colored glow and crisp gaps — matching the reference's clarity while staying on-brand with the dark + gold portal aesthetic.