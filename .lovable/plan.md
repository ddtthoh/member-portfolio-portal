## Remove white top sheen on Convert Details box

The `.liquid-glass` utility paints a white-to-gold top sheen via the `--glass-sheen-top` CSS variable (default 30%). This causes the visible white band at the top of the Convert Details card.

### Change

In `src/routes/portal.statement.convert-credits.tsx`, on the Convert Details container div, override that variable inline so the sheen disappears for this box only (wallet boxes and page header keep their look):

```tsx
<div
  className="liquid-glass rounded-xl p-5"
  style={{ ["--glass-sheen-top" as any]: "0%" }}
>
```

No other files change. The wallet/header boxes above are untouched.