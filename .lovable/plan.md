## Problem

The ticker isn't moving because `src/styles.css` has two bugs in the ticker block (lines 192–198):

1. `.ticker-track { animation: none; }` — animation is explicitly disabled, so the marquee never runs.
2. The `.ticker-wrap:hover .ticker-track { animation-play-state: paused;` rule is missing its closing `}`. This silently swallows the next rule (`.portal-backdrop`) and breaks the cascade for the dark portal background too.

## Fix

In `src/styles.css`, replace the broken block with:

```css
.ticker-track {
  animation: ticker-marquee 60s linear infinite;
  width: max-content;
}
.ticker-wrap:hover .ticker-track {
  animation-play-state: paused;
}
```

- 60s gives a slow, readable scroll across 50 tokens (×2 for the duplicated loop). Adjustable.
- Restores the missing `}` so `.portal-backdrop` becomes its own rule again.
- The existing `prefers-reduced-motion` override that sets `animation: none` is kept for accessibility.

## Out of scope

- No changes to `ticker-tape.tsx` — data fetching and click-through to Dexscreener already work.
- No other CSS rules touched.
