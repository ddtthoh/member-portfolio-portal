## Goals

1. Slow the ticker scroll for a calmer, more premium feel.
2. Upgrade the visual presentation from "plain text + dots" to a Bloomberg-terminal / private-bank-grade ticker that fits the gold-on-dark Ivory & Vale aesthetic.

## Speed change

`src/styles.css` — `.ticker-track` animation:
- From `60s linear infinite` → `180s linear infinite` (3× slower).
- Keep `:hover` pause and `prefers-reduced-motion` override.

## Visual upgrade

Each ticker item becomes a compact **"chip"** instead of inline text-with-dots:

```text
┌──────────────────────────────┐
│ ▲ PEPE   $0.00000431  +2.53% │
└──────────────────────────────┘
```

Per-chip styling:
- Subtle border `border-border/40`, soft `bg-card/40`, `backdrop-blur-sm`, `rounded-full`, `px-3 py-1`.
- Tiny up/down triangle (▲ ▼) in success/destructive color, replacing the `·` separators.
- Symbol in uppercase tracking-wide muted-foreground.
- Price in mono tabular-nums.
- 24h % in success/destructive with a faint colored background tint (`bg-success/10` / `bg-destructive/10`).
- On hover: border lifts to `border-gold/60`, soft gold glow shadow, subtle `translate-y-[-1px]`.
- Flash on price change: brief gold ring + gold text (already present, keep but soften).

Container changes (`src/components/ticker-tape.tsx`):
- Replace `gap-8` text row with `gap-3` chip row, `py-2.5`.
- Remove the `·` separator spans.
- Wrapper gets a thin top + bottom hairline already present; add **left/right edge fade masks** so chips fade into the background instead of getting clipped:
  ```css
  mask-image: linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%);
  ```
- Add a tiny "LIVE · DEXSCREENER" pill anchored to the left edge (absolute positioned, non-scrolling) for that terminal feel — optional, can skip if it crowds mobile.

## Files to change

1. `src/styles.css`
   - Bump `.ticker-track` animation duration to 180s.
   - Add `.ticker-mask` utility for left/right edge fade.
2. `src/components/ticker-tape.tsx`
   - Restyle each `<a>` chip as described.
   - Drop the `·` separator span.
   - Add edge-fade mask class to the scrolling container.
   - Add up/down triangle from `lucide-react` (`TrendingUp` / `TrendingDown`, size 10).

## Out of scope

- No data-source change — still top 50 boosted tokens from Dexscreener with link to the exact pair page.
- No layout/position change of the ticker on the page.
