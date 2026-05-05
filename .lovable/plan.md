## Goal

Make the "Current tier progress" button open a modal popup showing the user's tier progression details, instead of being a static button.

## Approach

Use the existing shadcn `Dialog` component (already installed at `src/components/ui/dialog.tsx`) — it handles overlay, focus trapping, escape-to-close, and animations out of the box, and matches the app's design system.

## Changes

**File: `src/routes/portal.index.tsx`**

1. Add imports:
   - `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogTrigger`, `DialogDescription` from `@/components/ui/dialog`

2. Wrap the existing button (line ~83-88) with `<Dialog>`:
   - `<DialogTrigger asChild>` around the current `<button>` so styling is preserved
   - `<DialogContent>` holds the popup body

3. Popup content (styled to match the gold/dark aesthetic of the tier card):
   - Title: "Tier Progression"
   - Current tier badge: Diamond
   - Progress bar (mirrors the 75% gold bar already on the page)
   - List of tiers with thresholds, e.g.:
     - Bronze — 0%
     - Silver — 25%
     - Gold — 50%
     - Platinum — 75% ← current marker
     - Diamond — 100%
   - Short hint text: "Reach 100% to unlock the next tier."

4. Reuse existing semantic tokens (`var(--gold)`, `border-gold/25`, `text-muted-foreground`) — no new colors.

## Open questions (defaults if no reply)

- Tier names/thresholds above are placeholders matching the bar's 0/25/50/75/100% marks — confirm or replace with real names.
- Popup is read-only; if you also want a CTA inside (e.g. "Upgrade now" linking somewhere), tell me where it should link.

## Out of scope

- Wiring real tier data from the database (currently the 75% / "Diamond" values are hard-coded). Can be a follow-up.
