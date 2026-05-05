## Add hide/unhide toggle for Est. Total Value & Today's PNL

Add an eye icon (like Binance/OKX) next to the "Est. Total Value (USD)" label. Clicking it masks both the total value and Today's PNL numbers with `******`. Clicking again reveals them.

### Changes to `src/routes/portal.index.tsx`

1. **Import icons**: add `Eye` and `EyeOff` to the existing `lucide-react` import.

2. **Add state** inside `Overview()`:
   ```ts
   const [hideBalance, setHideBalance] = useState(false);
   ```

3. **Update the Est. Total Value card** (around lines 51–61):
   - Place an `Eye`/`EyeOff` toggle button to the right of the "Est. Total Value (USD)" label (using the existing `flex justify-between` row).
   - Replace `$50,000.00` with `{hideBalance ? "******" : "$50,000.00"}`.
   - Replace `+$960.2(+1.92%)` with `{hideBalance ? "******" : "+$960.2(+1.92%)"}`.
   - Button uses `aria-label` that flips between "Show balance" / "Hide balance" and a hover color of `text-gold`.

### Notes / optional follow-ups
- State is local to this page only — toggling resets when navigating away. If you want it remembered across pages/refreshes, we can persist it in `localStorage` later.
- The same toggle could later be reused for the USDT / Rewards Wallet cards.