Fix the Reminder dialog on `/portal/deposit` so it actually shows on every visit.

**Root cause**: `DialogContent` uses the `liquid-glass` class whose `::before/::after` pseudo-elements paint opaque layers over the modal content, and the open-flip via `useEffect` can race the Radix portal mount, so nothing visible appears.

**Change** (`src/routes/portal.deposit.tsx`):
- Add a `mounted` flag that flips `true` in `useEffect`; only render the `<Dialog>` once mounted (avoids SSR hydration race).
- Initialize `reminderOpen` to `true` so the dialog is open on first client render.
- Replace `liquid-glass` on `DialogContent` with `bg-background/95 backdrop-blur-xl border border-gold/40 z-[100]` to remove the obscuring pseudo-element layers and stay above the portal shell stacking context.
- Keep title/description/icon/OK button identical.