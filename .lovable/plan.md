## Change

In `src/routes/portal.index.tsx`, on the Est. Total Value card, place each percentage to the right of its dollar amount on the same line, instead of stacked underneath.

## Layout

Before (stacked):
```
TODAY'S PNL
+$960.20
+1.92%
```

After (inline):
```
TODAY'S PNL
+$960.20  +1.92%
```

Same change applied to Total PNL.

## Implementation

Wrap the `+$amount` and `+x.xx%` spans in a `flex items-baseline gap-1.5` container so the smaller percentage sits to the right of the larger amount, baseline-aligned for a clean financial look. Percentage stays at smaller font size and slightly muted emerald (`text-emerald-400/80`) so the dollar value remains the primary number.
