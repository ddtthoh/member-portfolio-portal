## Changes to `src/components/marketing/mobile-poster.tsx`

### 1. Restore the Member ID box (without the Network box)

Earlier I removed the entire 2-column stats grid. I'll bring back just the Member box as a single full-width stat, locked to the invited member's id.

```tsx
<div className="mt-4">
  <Stat label="Member" value={`#${memberId}`} theme={theme} />
</div>
```

- Uses the existing `memberId` prop (already the default member id passed into `MobilePoster`), so it's effectively "locked".
- No Network/on-chain box.

### 2. Fix the "J" clipping in "Join Naslab Today"

The headline uses `font-serif font-black` with a gold gradient via `-webkit-background-clip: text`. At 84px the serif "J"'s descender is being cut off because:
- the container has `overflow-hidden` on the CTA card, and
- the heading's line-box doesn't reserve enough room below the baseline for the descender.

Fix in the `<h2>Join Naslab Today</h2>` block:
- Increase `lineHeight` from `1.15` to `1.25`
- Increase `paddingBottom` from `0.16em` to `0.28em`
- Add `overflow: "visible"` and a small `paddingLeft: "0.06em"` so the J's left curl/descender isn't clipped by the gradient text mask either

No other sections, fonts, colors, or layout change.
