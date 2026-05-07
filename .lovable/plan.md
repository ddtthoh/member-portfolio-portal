## Goal
Remove the four stat cards (Total Assets, 30D Growth, Volatility, Allocations) from `/portal/asset-analysis`. Keep only the page header and the Total Assets gauge.

## Edit `src/routes/portal.asset-analysis.tsx`
1. Remove the `stats` array and `totalFormatted` variable.
2. Remove the entire stats grid `<div className="mb-4 grid grid-cols-2 ...">...</div>` block.
3. Remove unused imports: `TrendingUp, PieChart, BarChart3, Activity` from `lucide-react`.

Result: page shows only the header + the 3-color half-donut gauge card.