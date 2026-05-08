## Problem

In `src/routes/portal.reports.team-rewards.tsx`, the previous fix set the three middle headers to `align="right" / "center" / "left"` to "balance" them around `division roi`. That's exactly what makes the headers look squeezed together when the preview gets narrow (e.g. when Visual Edits shrinks the viewport): Level is jammed against division roi which is jammed against Percentage, while Date / Member ID / amount sit far apart.

The table is already inside `overflow-x-auto` with `minWidth={720}` and 6 equal `w-1/6` columns, but at 720px each column is only ~120px wide, so any custom alignment makes adjacent labels collide visually.

## Fix (only this file)

1. Reset all 6 headers to default left alignment so each label sits at its own column's left edge — evenly spaced, no collisions:
   ```
   <Th>Date</Th>
   <Th>Member ID</Th>
   <Th>Level</Th>
   <Th>division roi</Th>
   <Th>Percentage</Th>
   <Th>amount</Th>
   ```
2. Increase the table `minWidth` from `720` → `960` so each column gets ~160px and the labels never touch, even on narrow widths. The wrapping `DataTable` already has `overflow-x-auto`, so the user can scroll horizontally on phone / Visual Edits / any narrow preview — exactly what was requested.

No other reports, pages, subpages, tabs, shared components, i18n, or backend code change.

## Files

- `src/routes/portal.reports.team-rewards.tsx` — change the `<Thead>` block (lines 24–26 alignments) and the `minWidth` prop on `<DataTable>` (line 18).
