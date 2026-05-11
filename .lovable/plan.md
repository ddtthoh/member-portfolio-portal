## Root cause

The "Your Position" card visibly shrinks once the wallet finishes loading. It is **not** a font/number size change — it is a vertical-height jump caused by conditional subtext under each of the three columns:

`src/routes/portal.staking-plans.tsx`

1. **Initial render** (`walletLoading = true`, `wallet.staking = 0`, so `hasStaking = false`):
   - Col 1 renders `MetricValue $0.00` **plus** an extra line: `"No active stake"` (`mt-1.5` + uppercase caption).
   - Col 2 renders `—` **plus** caption: `"Stake to unlock"`.
   - Col 3 renders `—` **plus** caption: `"Begin journey"`.
   - All three columns therefore have a 2-line stack.

2. **After wallet resolves** with `staking > 0` (`hasStaking = true`):
   - Col 1: `"No active stake"` is removed entirely (the `{!hasStaking && …}` block disappears).
   - Cols 2 & 3: caption line stays but text changes (similar height).
   - Col 1 loses ~18–20px → the whole card shrinks → visible "jump".

The CountUp / glow sweep is already correct; the residual jump is purely DOM layout, not animation.

## Fix

Reserve the subtext slot so it always occupies the same vertical space, regardless of `hasStaking` or `walletLoading`. Two small changes in `portal.staking-plans.tsx` only — no business logic, no new components.

### 1. Always render the caption row under "Your Staking"

Replace the conditional `{!hasStaking && <div…>No active stake</div>}` with an always-mounted caption that swaps text content (or renders an invisible non-breaking space when there's nothing to say). This keeps the column at a fixed 2-line height at all times:

```tsx
<div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 tabular-nums min-h-[1em]">
  {hasStaking
    ? "\u00A0"               // reserve the line height
    : t("pages.stakingPlans.labels.noStake", { defaultValue: "No active stake" })}
</div>
```

### 2. Stabilize the loading→loaded handoff in column 1

Currently the metric branch swaps from a `static` `MetricValue` to an animated one the moment `walletLoading` flips to `false`. Use a single branch keyed on the resolved value so the inline element doesn't briefly remount:

```tsx
{showAmount ? (
  <MetricValue
    value={wallet.staking}
    prefix="$"
    decimals={2}
    size="lg"
    static={walletLoading || wallet.staking <= 0}
    duration={SWEEP_MS}
    onStart={handleCountStart}
  />
) : ( /* masked dots — unchanged */ )}
```

This removes the second source of micro-jump (component identity change at the same instant the subtext disappears).

### 3. (Defensive) Pin a min-height on each of the 3 columns

Add `min-h-[88px] sm:min-h-[96px]` (matches the natural 2-line height) to each of the three column wrappers so any future caption text length change cannot reintroduce the jump.

## Verification

- Hard reload `/portal/staking-plans` with throttled network → card height should be identical before and after wallet loads.
- Toggle `showAmount` (eye icon) — no height change.
- Switch between an account with `staking = 0` and `staking > 0` — no height change.

## Files touched

- `src/routes/portal.staking-plans.tsx` (the "Your Position" card block only)

No CSS, no other components, no data layer.
