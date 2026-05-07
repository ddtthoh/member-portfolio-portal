# Default P/L Calendar to List View

Change the initial view state in `src/components/pl-calendar.tsx` from `"calendar"` to `"list"` so tablet and desktop also open in list mode by default. The List/Calendar toggle remains available at ≥560px so users can switch to Calendar when desired.

## Change

- `src/components/pl-calendar.tsx` line 71:
  - From: `const [view, setView] = useState<"calendar" | "list">("calendar");`
  - To:   `const [view, setView] = useState<"calendar" | "list">("list");`

No other changes needed.