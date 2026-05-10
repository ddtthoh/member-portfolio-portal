## Goal

Redesign the **Portfolio total-asset card** on `/portal/holdings` to match the uploaded reference: a large **full-circle segmented donut** with the total in the center, an eye/hide toggle, and a breakdown list below — adapted to the existing dark/gold liquid-glass design system. Add a **glowing arc effect** and a **rotating draw-in animation** that sweeps the segments out starting from the left.

## Visual mapping

| Reference | Our version |
|---|---|
| Big donut, 3 colored arcs | Full-circle donut, 3 arcs using `--asset-participation` (Staking), `--asset-cash` (USD), `--asset-earnings` (Rewards) |
| "Total savings RM 425,688.44" | "Portfolio" label + animated `$total` in gold (`CountUp`) |
| "Balance as of 10 May 2026" | "Balance as of {today}" subline |
| Eye + "Hide Amount" under total | Eye toggle moved under the total number |
| "Hide All Accounts" + colored dots + chevron | Collapsible "Breakdown" row with stacked dots + chevron |
| 3 account rows | Staking / USD / Rewards rows: dot, label, amount, % share |

Card stays `liquid-glass` on dark; we keep our gold/teal/violet palette (do **not** copy the reference's literal blue/red/orange).

## Layout

```
┌─────────────────────────────────────┐
│ PORTFOLIO                           │
│        ╭───────────────╮            │
│       │   ◯ donut     │             │
│       │  Total Assets │             │
│       │  $50,000.00   │             │
│       │   ◉ Hide      │             │
│        ╰───────────────╯            │
│  Balance as of 10 May 2026          │
│ ─────────────────────────────       │
│ ◉◉◉  Breakdown              [⌄]    │
│  ● Staking   $30,000   60%          │
│    54 days · since Mar 16           │
│  ● USD        $5,000   10%          │
│  ● Rewards   $15,000   30%          │
└─────────────────────────────────────┘
```

## Donut animation — "rotate-out from the left" + glow

- SVG `<circle>` with `pathLength={1}`, starting at the **9 o'clock** position by applying `transform="rotate(-180 cx cy)"` to the segment group (so segment 0 begins at the left edge of the circle and sweeps clockwise).
- Each segment uses `strokeDasharray="<len> 1"` and `strokeDashoffset` for cumulative position. On mount (gated by `useInView`, `once: true`), framer-motion `animate(0, len, { duration: 1.2, ease: [0.16, 1, 0.3, 1] })` grows each segment in sequence with a 0.2–0.25s stagger — visually a single arc unrolling clockwise from the left.
- **Glow:** each colored arc gets `filter: drop-shadow(0 0 8px color-mix(in oklab, <color> 65%, transparent)) drop-shadow(0 0 18px color-mix(in oklab, <color> 35%, transparent))` for a soft outer halo. A faint full-circle track sits underneath at low opacity.
- Center number (`CountUp`) starts at the same time as the draw, so the total counts up while the arc sweeps.
- Respects `prefers-reduced-motion` (snap to final state).

## Technical changes

1. **New component** `src/components/portfolio-donut-card.tsx`
   - Props: `{ totalAssets, usd, rewards, staking, stakingDays, sinceDate, showAmount toggle internal }`
   - Wrapped in `SpotlightCard` + `liquid-glass`
   - Full-circle SVG (≈220×220), 3 segments, glow filters, framer-motion draw-in starting from 9 o'clock
   - Center stack: label · `<CountUp>` total in gold · eye/hide button
   - Below: "Balance as of {date}" + collapsible breakdown list (framer-motion height + chevron rotate)

2. **Replace usage** in `src/routes/portal.holdings.tsx`
   - Swap `<StakingOverviewCard …/>` → `<PortfolioDonutCard …/>` with the same `useWallet()` props
   - `staking-overview-card.tsx` stays in repo unused (delete in a follow-up if confirmed)

3. **i18n** (English first; other locales fall back):
   - `pages.holdings.balanceAsOf`
   - `pages.holdings.breakdown`
   - `pages.holdings.hideAccounts` / `showAccounts`

4. **Design tokens only**: arcs/dots use `--asset-*` tokens; text uses `text-gold` / `text-muted-foreground`; card uses `liquid-glass`. No new hex colors.

5. **No backend / wallet / RLS changes.**

## Out of scope

- The half-arc `TotalAssetsGauge` on `/portal/asset-analysis` is left untouched.
- No literal blue/red/orange palette from the screenshot.

## Confirm before I build

- Breakdown list **collapsible with chevron** (matches reference) or **always expanded** like today?
