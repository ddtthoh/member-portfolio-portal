## Issue
The user is on `/portal/asset-analysis` but doesn't see the new 3-color half-donut. The gauge component was previously moved to the portal home (`/portal`) only — the asset-analysis route currently shows just 4 stat cards (Total Assets / 30D Growth / Volatility / Allocations) with no chart.

## Fix
Add the `TotalAssetsGauge` back to the `/portal/asset-analysis` page as the hero section, above the stats grid.

### Edit `src/routes/portal.asset-analysis.tsx`
1. Add imports:
   - `TotalAssetsGauge` from `@/components/total-assets-gauge`
   - `SpotlightCard` from `@/components/spotlight-card`
2. Insert a `motion.div` containing a `SpotlightCard` with `<TotalAssetsGauge staking={wallet.staking} usd={wallet.usd} rewards={wallet.rewards} />` directly above the existing stats grid.
3. Keep the 4 stat cards underneath unchanged.

No other file changes needed — the gauge component itself was already updated in the prior turn with the 3-color (Gold / Teal / Violet) refined half-donut.