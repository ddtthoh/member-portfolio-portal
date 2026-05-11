Fix plan:

1. Make `CountUp` fire `onStart` inside the first `requestAnimationFrame` tick, exactly when the displayed value first moves above 0, instead of before the frame is painted.

2. Add an `onComplete` callback to `CountUp`, fired when the count-up reaches the final value.

3. Pass `onComplete` through `MetricValue` only for this staking amount metric.

4. In `portal.staking-plans.tsx`, start the first glow from `onStart`, then start the second glow from `onComplete` so:
   - first glow begins when `0` starts moving,
   - first glow ends when the number reaches the real value,
   - second glow starts immediately after the first,
   - both glows use the same 2.5s duration.

5. Remove the timeout-based second glow scheduling, because it can drift from the real count-up frame timing.