## Goal
Rename the "Performance" sidebar item to "Statement". Clicking it expands an inline submenu with three children: Credit Conversion, USD Statement, Rewards Statement. Each opens its own subpage.

## Changes

### 1. `src/components/portal-shell.tsx`
- Replace the `Performance` nav entry with a `Statement` entry that has a `children` array:
  - Credit Conversion → `/portal/statement/credit-conversion`
  - USD Statement → `/portal/statement/usd`
  - Rewards Statement → `/portal/statement/rewards`
- Render nav items: if an item has `children`, render a button that toggles an expanded state (auto-expanded when current path starts with its base). Children render as indented `<Link>`s underneath, with the same active styling.
- Use `FileBarChart` (or keep `LineChart`) icon for Statement; small dot/dash icons (or `ChevronRight`) for children.

### 2. New route files (3)
- `src/routes/portal.statement.credit-conversion.tsx`
- `src/routes/portal.statement.usd.tsx`
- `src/routes/portal.statement.rewards.tsx`

Each is a simple page using `PageHeader` and a `liquid-glass` placeholder card describing the statement type. Reuse the existing styling pattern from `portal.performance.tsx` so the look matches the rest of the portal.

### 3. Remove old Performance route
- Delete `src/routes/portal.performance.tsx` (the route tree regenerates automatically).

## Out of scope
- No data wiring for the new statements (placeholder content only).
- No changes to other sidebar items, theme, or styles.
