## Why the bars don't animate left→right

Currently the `BarChart` / `ComposedChart` mounts on first render (when `inView` is still `false`), and only the `<Bar>` / `<Line>` / `<Area>` children are gated behind `{inView && ...}`. When `inView` later flips to `true`, those children get added into an already-mounted chart — and Recharts only fires its entrance animation when the **whole chart** mounts. The result: bars appear at full width with no left→right animation.

The numbers slide because they use our own `progress` ramp, not Recharts' animation.

## Fix

Gate the entire chart on `inView` so the whole `<ResponsiveContainer>` mounts fresh when the card scrolls into view. That guarantees Recharts runs its built-in 0→actual animation for bars/lines/areas.

### `src/components/charts/rewards-breakdown-chart.tsx`
- Wrap the contents of `<div className="h-64 w-full">` so the entire `<ResponsiveContainer>` only renders when `inView` is true.
- Remove the `{inView && ...}` wrapper around `<Bar>` (the parent gate replaces it).
- Keep `isAnimationActive` and `animationDuration={2200}` on the `<Bar>`.
- While `inView` is false, render an empty placeholder of the same height so layout doesn't jump.

### `src/components/charts/asset-growth-chart.tsx`
- Same pattern for the main chart `<div className="h-52 w-full">`: gate the whole `<ResponsiveContainer>` / `<ComposedChart>` on `inView`. Remove the `{inView && ...}` wrappers around `<Area>` and `<Line>`.
- For the 6 sparkline cards, gate each card's `<ResponsiveContainer>` block on `inView` (remove the per-`<Area>` `{inView && ...}`). Keep the height so the card layout is stable.
- Keep the existing `useCountProgress` ramp for the end-label numbers and the sparkline value labels.

### Not changing
- `useInViewOnce` thresholds (working as intended).
- `CountUp` behavior, durations, breathing glow CSS.
- Any business logic, data hooks, or styling.

After this, scrolling into either chart will mount the chart fresh and Recharts will animate all bars/lines/areas from 0 over 2.2s, in sync with the count-up numbers.
