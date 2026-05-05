## Plan: remove Referral from sidebar nav

Remove the "Referral" entry (and its now-unused `UserPlus` icon import) from the sidebar nav array in `src/components/portal-shell.tsx`.

Leave intact:
- The Referral tile on the `/portal` overview (still navigates to `/portal/referral`)
- The `/portal/referral` route file itself

Only the sidebar link is removed.

### Files touched

- `src/components/portal-shell.tsx` — drop the `{ to: "/portal/referral", ... }` line and remove `UserPlus` from the lucide import.