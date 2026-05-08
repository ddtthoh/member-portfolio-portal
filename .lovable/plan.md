## Why edits "leak" between report pages

Two of the five report pages don't have their own table — they reuse the shared `ReportPlaceholder` component:

- `portal.reports.referral-rewards.tsx` → `<ReportPlaceholder title="Referral Rewards" />`
- `portal.reports.par-rank-rewards.tsx` → `<ReportPlaceholder title="Par Rank Rewards" />`

Both render `src/components/report-placeholder.tsx`, which contains the columns (Date / division roi / Referral rates / Member ID). So when that component is edited, both pages change at the same time.

The other three (`staking`, `team-rewards`, `leader-rewards`) already have their own inline table per file and are NOT linked to anything.

> Note: identical text strings across files do NOT auto-sync — only shared components/translation keys do. The only shared piece here is `ReportPlaceholder`.

## Fix — make each report fully independent

1. **Inline the table into `portal.reports.referral-rewards.tsx`**, copying the same structure used by the other report files (PageHeader + ReportShell + DataTable). Default columns: Date / Member ID / Percentage / Amount (4 cols) — adjustable later.
2. **Inline the table into `portal.reports.par-rank-rewards.tsx`** the same way. Default columns: Date / Rank / Percentage / Amount (4 cols).
3. **Delete `src/components/report-placeholder.tsx`** so nothing can accidentally re-share it later.
4. Leave `staking`, `team-rewards`, `leader-rewards` untouched — they're already standalone.

After this, every one of the 5 report subpages is its own self-contained file. Editing one will never affect another.

## Files touched

- edit `src/routes/portal.reports.referral-rewards.tsx`
- edit `src/routes/portal.reports.par-rank-rewards.tsx`
- delete `src/components/report-placeholder.tsx`

## Out of scope

- No translation/i18n changes.
- No design/styling changes — same look, just per-page ownership.