## Root cause

`src/routes/portal.reports.tsx` is the **layout/parent route** for all `/portal/reports/*` children (staking, leader-rewards, par-rank-rewards, referral-rewards, team-rewards). Its `beforeLoad` unconditionally throws `redirect({ to: "/portal/reports/staking" })`.

Because TanStack Router runs the parent's `beforeLoad` on **every** child match, visiting `/portal/reports/staking` triggers the parent → redirect → re-match parent → redirect → infinite loop. The browser eventually shows the "Page unresponsive — wait / exit" dialog. This is why staking (and any other reports child) cannot load.

## Fix

The redirect logic belongs on the bare `/portal/reports` URL only, not on the parent layout. Two clean options; I'll use Option A (smallest change):

**Option A — make it an index route**
1. Rename `src/routes/portal.reports.tsx` → `src/routes/portal.reports.index.tsx`
2. Change the route path from `/portal/reports` to `/portal/reports/` (index). The `beforeLoad` redirect then only fires when the user hits `/portal/reports` exactly, not its children.

After the rename, the children (`portal.reports.staking.tsx`, etc.) become top-level flat routes under `/portal/reports/*` with no parent layout — which is what the current code already assumes (none of them rely on an `<Outlet />` from the parent).

## Verification
- Hard-refresh `/portal/reports/staking` → renders `ReportPlaceholder` cleanly, no hang.
- Visit `/portal/reports` directly → still redirects to `/portal/reports/staking`.
- Other report children (`/portal/reports/leader-rewards`, etc.) load normally.
