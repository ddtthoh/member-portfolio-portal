The 5 report pages (`team-rewards`, `leader-rewards`, `par-rank-rewards`, `referral-rewards`, `staking`) share `ReportShell`, which has these problems:

- The Filter panel is **collapsed by default** so it looks like nothing is there; user has to know to click the small "Filter" header to reveal it.
- The filter Apply / Reset buttons are wired to nothing — the parent pages never pass `onApply` / `onReset`.
- The Export button is wired to nothing — pages never pass `onExport`, so clicking it does nothing.
- The filter only ever shows a generic "Member ID" text field, even on pages where a different field (transaction no., rank, contributed by, etc.) is more appropriate.

## Fix

1. **Make Filter always visible by default**
   - Default `CollapsibleFilter` to `defaultOpen={true}` for report pages so the date picker, search field, Filter and Reset buttons appear immediately.
   - Keep the chevron toggle so users can still collapse it.

2. **Wire Filter to actual page state**
   - Lift filter state (`date`, `text`) into each report page via `ReportShell` props.
   - Add `filterTextLabel` prop to `ReportShell` so each report shows the correct label:
     - team-rewards / referral-rewards → Member ID
     - leader-rewards → Contributed By
     - par-rank-rewards → Rank
     - staking → Transaction No.
   - Apply filters client-side on the (currently empty) row arrays — when data is later added, filtering will Just Work.

3. **Wire Export to a real CSV download**
   - Add a `getExportRows` callback prop on `ReportShell` returning `{ headers, rows }`.
   - On Export click, build a CSV blob and trigger a download (`<page-name>-<yyyymmdd>.csv`).
   - When there are no rows, show a toast "No records to export" (translation key already exists: `pages.transactions.empty.noRecordsExport`).

4. **Visual polish on the Filter / Export bar**
   - Add an icon to both buttons (Funnel for Filter, Download for Export) so they read as actions, not plain pills.
   - Stack correctly on mobile (full-width buttons), inline on desktop.
   - Make sure the section header above the table doesn't collide with the Export button on small widths.

5. **Apply identically to all 5 report pages** so they look and behave consistently.

## Technical notes

- All changes live in `src/components/report-shell.tsx` plus the 5 `src/routes/portal.reports.*.tsx` files.
- No backend / schema changes.
- CSV export uses a tiny inline helper (no new dependency); values are escaped with the standard `"` doubling rule.
- `defaultOpen` already exists on `CollapsibleFilter`, so no new component API is needed there.