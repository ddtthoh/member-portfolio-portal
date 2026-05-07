Update `src/routes/portal.statement.credit-conversion.tsx`:

- Replace fixed pixel column widths `grid-cols-[110px_120px_140px_130px_100px]` with content-sized `grid-cols-[auto_auto_auto_auto_auto]` on both header and row grids so each label gets exactly the width its text needs and "Destination Credit" no longer touches the gold divider.
- Increase column gap from `gap-x-6` to `gap-x-8` for even, comfortable breathing room.
- Reduce per-cell padding from `px-3` to `px-2` (the larger gap now handles spacing).
- Change inner wrapper from `min-w-[640px]` to `min-w-max` so the grid expands to its natural width and the outer `overflow-x-auto` can actually scroll right on the 390 px mobile viewport to reveal the Status column.
- Keep dividers, typography, empty-state, and zero-width-space placeholder unchanged.

Result: headers (Date, Source Credit, Destination Credit, Converted Amount, Status) sit evenly spaced without touching dividers, no awkward empty gaps, and the table scrolls horizontally on mobile.