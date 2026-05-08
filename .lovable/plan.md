## Problem

In `src/routes/portal.reports.team-rewards.tsx`, the table has 6 equal-width columns. "division roi" is in column 4 and is geometrically centered in its own cell, but because "Level" (col 3) and "Percentage" (col 5) are both left-aligned, their text sits at the left edge of each column. Result: "Level" text is far away on the left, "Percentage" text is right next to "division roi" — so "division roi" looks pushed toward Percentage.

Just toggling `align="center"` on the single Th cannot fix this — it only centers within column 4, which is already what's happening.

## Fix (only this file, only this header row)

Adjust the alignment of the three middle headers so their visible text is balanced around "division roi":

- `<Th align="right">Level</Th>` — pushes "Level" text to the right edge of col 3
- `<Th align="center">division roi</Th>` — centers in col 4
- `<Th align="left">Percentage</Th>` — keeps "Percentage" at the left edge of col 5

Now the three labels read: `Level   division roi   Percentage` with roughly equal gaps on both sides of "division roi", at every viewport (phone / tablet / desktop), because the columns are all `w-1/6` and the rule is purely text-align based.

The table body currently only renders `<EmptyRow colSpan={6}>` so no data cells need to be re-aligned. Other reports, pages, subpages, tabs, and shared components are untouched.

## Files

- `src/routes/portal.reports.team-rewards.tsx` — change lines 24–26 only.
