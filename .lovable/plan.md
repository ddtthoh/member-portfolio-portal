## Why the variable isn't working

`calc(var(--glass-opacity) * 100%)` inside `color-mix()` is rejected/ignored by most browsers today — `color-mix()` percentages must be literal `<percentage>` tokens, not computed values. That's why bumping `--glass-opacity` from 0.3 → 0.5 produced no visible change.

## Fix

Rewrite `.liquid-glass` so `--glass-opacity` controls the whole element via the standard `opacity` property (which always works), and restore the inner color-mix percentages to fixed, well-tuned values so the glass still looks rich at full opacity.

**Edit `src/styles.css` (lines 105–155)** — replace the current `.liquid-glass` block with a version that:

- Sets `--glass-opacity: 0.7` (your current request)
- Applies `opacity: var(--glass-opacity)` on `.liquid-glass` itself
- Keeps `transition` so opacity changes animate smoothly
- Restores fixed percentages for background (`var(--card) 100%`), border (`white 30%`), inset highlights, `::before` radial (`white 50%`), and `::after` gradient — these are the values that look correct at opacity 1, then the master opacity scales the whole thing down

Future "set glass opacity to X" requests become a one-line change to `--glass-opacity`, and they will actually take effect.

## Trade-off to confirm

Using `opacity` on `.liquid-glass` also fades any **content** that's a direct child (text, icons, prices). Looking at `portal.index.tsx`, all the glass cards have text inside them — so at 0.7 the gold numbers and labels would also be at 70%.

Two options:

1. **Accept it** — glass + content fade together (simplest, what most "frosted glass" UIs do).
2. **Keep content full-opacity** — wrap the glass background in a `::before` pseudo-layer that carries all the visuals, and apply `--glass-opacity` only to that layer. Content stays crisp at 100%.

I recommend **option 2** since you've been carefully tuning the gold text/numbers — they shouldn't fade when you make the glass more transparent. Confirm and I'll implement option 2.
