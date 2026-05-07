# Fix Deposit Reminder Popup Not Showing

The reminder dialog on `/portal/deposit` doesn't appear because initializing `useState(true)` during SSR causes the dialog to render server-side, which conflicts with the client hydration (the page just hydrated into another route — the global page transition `<AnimatePresence>` in `portal-shell.tsx` may also unmount/remount, but the root cause is the SSR/CSR mismatch suppressing the modal).

## Fix

In `src/routes/portal.deposit.tsx`:

- Initialize `reminderOpen` as `false`.
- Open it in a `useEffect` on mount so it only triggers client-side after navigation/hydration completes.

```tsx
const [reminderOpen, setReminderOpen] = useState(false);
useEffect(() => { setReminderOpen(true); }, []);
```

Add `useEffect` to the existing `useState` import.

No other changes.