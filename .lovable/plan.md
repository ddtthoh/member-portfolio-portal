In `src/routes/portal.index.tsx`:

1. Add `labelOnly: true` to the Deposit tile entry.
2. Update the `Stat` component to accept a `labelOnly` prop. When true, render only the label centered with larger serif type (`text-2xl`) — no icon, no sparkline, no value.
3. Other tiles (Withdrawal, Portfolio Value, Unrealized P/L, Positions) remain unchanged.

Result: the Deposit box shows only the word "Deposit" in a large serif font, centered, with no icon or sparkline.