## Add "Total AUM" box above the Total Members card

In `src/routes/portal.network.tsx`, insert a new `SpotlightCard` immediately above the existing filter/stats card (the one with "Total Members"). It will mirror the exact same structure, styling, fonts, sizing, gold tokens, and layout — only the title and value change.

### Content
- Title: `Total AUM` (same `text-[10px] uppercase tracking-[0.25em] text-gold/80`)
- Value: `$2,450,000` rendered with `CountUp` (`prefix="$"`, `decimals={0}`), same `text-5xl font-light tabular-nums tracking-[-0.02em] text-gold`
- From row: `From` label + `Any month` + `Any year` selects (same gold styling)
- To row: `To` label + `Any month` + `Any year` selects + Reset button when active

### State
Add independent filter state so AUM filter doesn't affect Members filter:
- `aumFromMonth`, `aumFromYear`, `aumToMonth`, `aumToYear` (each defaults to `"all"`)
- `aumFilterActive` derived flag
- `resetAumFilter()` handler
- Constant `TOTAL_AUM = 2_450_000` (display only — no business logic change)

### Placement
Insert the new card right before the existing `<SpotlightCard className="liquid-glass mb-4 rounded-2xl p-5">` (current Total Members card), wrapped with the same `mb-4` spacing. No other content, styles, or components are modified.

### Files
- `src/routes/portal.network.tsx` (only file touched)
