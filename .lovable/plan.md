## Goal
Add USD amount alongside percentage in the gauge legend, with a more professional, institutional layout (vs the current bare 3-column percent grid).

## Edit `src/components/total-assets-gauge.tsx`
Replace the current 3-column grid (lines ~114–160) with a vertical stacked-row list layout:

```
─────────────────────────────────────────
 ●  PARTICIPATION         $50,000.00  75.49%
─────────────────────────────────────────
 ●  CASH                  $12,340.00  18.63%
─────────────────────────────────────────
 ●  EARNINGS              $ 3,897.00   5.89%
─────────────────────────────────────────
```

Per row:
- Left: small colored dot (with matching glow) + uppercase tracked label in muted small text
- Right: USD amount (in segment's color, light weight, tabular-nums) + percent (smaller, muted, fixed width for alignment)
- Dividers (top + between rows) using `border-border/40` for the financial-statement feel
- Padding `py-2.5` per row, `mt-5` from the arc above

Use a `[{label, amount, pct, color}]` array mapped to rows to keep code DRY. Both amount and percent animated via existing `CountUp`.

This matches private-bank / Bloomberg-style account breakdowns: amount as the hero, percent as the supporting detail, lined up right-aligned for fast scanning.