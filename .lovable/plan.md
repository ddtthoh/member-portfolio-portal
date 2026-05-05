## Make Deposit tile clickable, navigate to /portal/deposit

1. **Create `src/routes/portal.deposit.tsx`** — new page with `PageHeader` ("Deposit") and two `liquid-glass` cards: wire transfer instructions and notes.
2. **Edit `src/routes/portal.index.tsx`** — wrap the Deposit tile in `<Link to="/portal/deposit">` with hover affordance (gold border on hover).
3. **Edit `src/components/portal-shell.tsx`** — add a "Deposit" entry to the sidebar nav with the `ArrowDownToLine` icon.