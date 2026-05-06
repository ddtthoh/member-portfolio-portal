## Goal
On hover, every `.liquid-glass` box across `/portal` and all subpages should turn into a strongly blurred, near‑opaque liquid glass surface. Idle look stays exactly as it is now.

## Change
Single file: `src/styles.css`, the `.liquid-glass` utility block.

1. Extend the existing transition to also animate `backdrop-filter`.
2. On `:hover`:
   - Increase blur from `blur(24px) saturate(150%)` to `blur(40px) saturate(180%)` (fully blurry).
   - Push the fill + sheen (`::before` and `::after`) opacity up to `0.96` (very low transparency).
   - Strengthen the gold border (`60%` instead of `50%`).
   - Keep the existing lift and gold glow shadow.
3. Add a smooth `opacity 0.35s ease` transition on the pseudo‑elements so the fade‑to‑opaque is fluid.

## Why this works for every page
`.liquid-glass` is the shared utility used by all card/box surfaces (PageHeader, holdings cards, staking plan tiers, documents, network, etc.), so updating the rule cascades the hover effect everywhere with no per‑page edits.

## Out of scope
- No changes to idle appearance, typography, colors, or layout.
- No changes to dark vs light token values; the hover state uses both themes' existing `--card` and `--gold` so it adapts automatically.
