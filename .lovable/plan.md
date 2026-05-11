## Root cause

The glow doesn't line up with the number because the two animations are driven by **different triggers**:

- **Sweep** — fires on a `setTimeout(0)` right after the card mounts. So it starts the instant the card appears.
- **Number (CountUp inside `MetricValue`)** — does NOT start on mount. It waits for an `IntersectionObserver` to report the element is in the viewport (and uses the default 1500ms duration). The IO callback fires one tick *after* mount, so the sweep is already partway through (or finished) before the digits even leave 0.

That's why "the number hasn't started yet but the first glow is already done", and why each glow feels too fast — the eye expects it to last as long as the count-up, but it actually races ahead.

## Fix

Sync both animations to the same trigger and the same duration.

### 1. `src/routes/portal.staking-plans.tsx` — Your Position card

- Remove the mount-time `setTimeout(0)` / `setTimeout(SWEEP_MS)` pair.
- Add an `IntersectionObserver` (threshold ~0.2, same as `CountUp`) on the card wrapper. When the card first enters the viewport:
  - Fire sweep #1 immediately.
  - Fire sweep #2 exactly `SWEEP_MS` later (back-to-back, no gap).
- Run this once only (disconnect after first intersection) so it never repeats.
- Set `SWEEP_MS = 1500` to match the `CountUp` default duration.
- Pass an explicit `duration={1500}` to the staking-amount `MetricValue` so the two are guaranteed identical even if `CountUp`'s default ever changes.

### 2. `src/styles.css` — keyframe duration

- Change `.animate-position-sweep` animation duration from `1.5s` (current) to match `SWEEP_MS` exactly: `1.5s`. (Already 1.5s after last change — keep, but confirm it's `1.5s` and `1 both` so it plays exactly once per mount of the overlay element. The `key={sweepKey}` remount handles the second play.)

### Result

- First sweep starts the same frame the digits leave `$0.00`.
- First sweep finishes the same frame the digits hit the final amount.
- Second sweep plays immediately after, same speed, no gap.
- After two plays, no more glow ever (until next page load / re-enter).

### Out of scope

- No changes to `CountUp`, `MetricValue` defaults, or any other card on the page.
- No changes to business logic, wallet data, or the tier sections.