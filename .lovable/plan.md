## Goal
Refine numeral typography ONLY on the mobile invite poster (`src/components/marketing/mobile-poster.tsx`). No other pages, no other components, no logic/data changes.

## Scope (where numbers appear)
1. Hero stats row — `0.45%`, `13.5%`, `24/7` with small-caps labels
2. Tier cards — Monthly range `4.5 – 7.5%` and Daily range `0.15 – 0.25%` (Standard / Advance / Premium)
3. Inline copy — "From 4.5% to 13.5% a month."

## Numeral treatment (Manuscript Classic)
For every numeric value above, render with this structure:

- **Integer part** at base size (current size kept), serif, gold
- **Decimal `.NN`** at ~55–60% of the integer size, same serif, same color, slightly tighter letter-spacing
- **`%` sign** at ~45–50% of integer size, lowered opacity (~80%), small left margin
- **Range separator** changes from current dash to an italic em-dash `—` at ~70% size, opacity 40%, with `mx` spacing
- **`24/7`** — slash rendered at ~60% size, opacity 60%, with `px-1`
- **Inline copy** — decimals use `align-top` superscript style at ~40% size, integers at base, `%` follows integer at base

Add `font-feature-settings: "lnum" 1, "tnum" 1` (lining + tabular figures) on the numeric spans for clean alignment.

Keep current font family (existing serif) and current gold color tokens — no new fonts, no new colors, no gradient ramps. This guarantees html2canvas export stability we just fixed.

## Implementation
Add a small internal helper inside `mobile-poster.tsx`:

```text
<Num value="13.5" unit="%" />
<NumRange from="4.5" to="7.5" unit="%" />
<NumRatio left="24" right="7" />
```

Each helper outputs the spans with the size/opacity hierarchy above. Both preview and `exportMode` produce the same DOM (only font/color resolution differs, which `exportMode` already handles).

Replace the existing inline numeric JSX in:
- Hero stats block
- Each tier card's monthly + daily lines
- The "From X% to Y% a month." sentence

## Files changed
- `src/components/marketing/mobile-poster.tsx` (only)

## Out of scope
- No changes to `portal.landing-page.tsx`, other portal pages, dashboard, or shared number formatting.
- No data, no i18n, no business logic.

## Verification
1. Visual check of `/portal/landing-page` preview — hero, all 3 tier cards, inline sentence
2. Trigger Download PNG — confirm numerals render identically (exportMode keeps solid gold + system serif we set previously)
3. Trigger Download PDF — same check
