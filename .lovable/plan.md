## Goal

Transform the `/portal` overview into a world-class, futuristic, sleek dashboard by combining: hero card glow-up, bento layout + density pass, and motion & polish pass.

## New components (3 small reusable files)

1. `src/components/count-up.tsx` — animated number counter (framer-motion `animate`, eases value from 0 to target on mount/in-view, supports prefix/suffix/decimals).
2. `src/components/sparkline.tsx` — pure-SVG mini chart with animated draw-on stroke + gradient area fill. Lightweight, no chart lib.
3. `src/components/spotlight-card.tsx` — wrapper that adds three premium glass effects: cursor-tracked gold radial spotlight, specular top edge highlight, and very subtle SVG noise grain overlay. Composes with existing `liquid-glass` utility.

## Hero section restructure (`src/routes/portal.index.tsx`)

Switch from 2-equal-column grid to a **bento layout**:

```text
+--------------------------------+----------------+
|                                |  STAKING       |
|   EST. TOTAL VALUE (hero)      |  (compact)     |
|   $50,000.00 (count-up)        +----------------+
|   sparkline                    |  ASSET         |
|   +1D pill   +ALL pill         |  ANALYSIS →    |
+--------------------------------+----------------+
```

- Hero card: spans 2/3 width on `sm+`, full width on mobile. Wrapped in `SpotlightCard` for cursor glow + grain + specular line.
- Right column: stacked staking + asset analysis (1/3 width on `sm+`).
- Use `rounded-2xl` on hero, keep `rounded-xl` on small cards (intentional radius hierarchy).

## Hero card content upgrades

- **Number typography**: `$50,000.00` rendered with `CountUp`, uses a larger, lighter weight (`text-5xl sm:text-6xl font-light tracking-[-0.04em]`) — premium thin-but-big feel instead of bold.
- **Sparkline** beneath the value: 14-day mock trend (green if positive), animated draw-on, `h-9` width-full.
- **PNL pills**: replace plain text with chip badges
  - `bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 rounded-md px-2 py-0.5`
  - Includes a small `↑` arrow icon (lucide `ArrowUpRight`)
  - Layout: label on top, then a row of `[chip $amount] [chip +%]`
- **Timeframe pills**: small pill row `1D · 1W · 1M · 1Y · ALL` (display-only for now), `text-[10px] uppercase tracking-[0.2em]` — signals pro tool.
- **Last updated** timestamp in tiny muted text bottom-right of hero (`text-[10px] text-muted-foreground`).
- **Live dot**: pulsing green 6px dot next to "EST. TOTAL VALUE" label = "live data" cue.

## Right column upgrades

- Staking card: same label-over-value style, but values use `CountUp` (85 days, $50,000), `tabular-nums`, lighter weight.
- Asset Analysis link: upgrade from plain row to a **mini CTA card** with a small icon (lucide `LineChart`), the label, and an animated chevron. Hover triggers gold tint via `SpotlightCard`.

## Wallet + action tiles polish (lower section)

- Wallets: add tiny sparkline placeholder under each value, wrap in `SpotlightCard`, switch values to `CountUp`.
- Action tiles: tighten to `rounded-2xl`, add subtle `hover:translate-y-[-2px]` and gold-tinted `ring` on hover. Stagger entrance more tightly (`delay: i * 0.04`).

## Global card polish (one-shot via CSS)

In `src/styles.css`, enhance `.liquid-glass`:
- Add a `::after` thin gold inner-edge glow at 8% opacity (so all cards get a *very subtle* premium edge without becoming "all gold border").
- Slightly tighten hover `box-shadow` for a more refined lift.

## Why this hits "world-class"

- **Hierarchy**: hero dominates via size + spotlight; everything else recedes.
- **Motion**: count-up + sparkline draw-on + cursor spotlight = "alive, not static".
- **Material**: grain + specular + glass = Apple Vision Pro / Mercury aesthetic.
- **Density signals**: timeframe pills, live dot, last-updated timestamp = pro fintech tool.
- **Restraint**: gold stays meaningful (hero, accents, hover), not slathered on every card.

## Files changed

- New: `src/components/count-up.tsx`, `src/components/sparkline.tsx`, `src/components/spotlight-card.tsx`
- Edit: `src/routes/portal.index.tsx` (hero section + wallets + tiles)
- Edit: `src/styles.css` (subtle `.liquid-glass::after` gold edge, refined hover shadow)

No new dependencies required — uses existing framer-motion, lucide-react, and tailwind.
