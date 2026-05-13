Three focused edits to `src/routes/portal.monthly-report.tsx`. UI / presentation only — no data model or schema changes.

## 1. Dates → last day of each report's month

Currently each card prints `new Date(r.created_at).toLocaleDateString()` → that's where `13/05/2026` comes from. Replace with the **last day of the month the report covers** (derived from `r.period`, e.g. `"April 2026"`, `"2026-04"`, etc.).

- Add a small helper `lastDayOfPeriod(period: string | null): string` that:
  - parses `period` flexibly (accepts `"April 2026"`, `"Apr 2026"`, `"2026-04"`, `"2026/4"`)
  - returns `dd/mm/yyyy` of the **last day of that month** (e.g. April 2026 → `30/04/2026`, Feb 2026 → `28/02/2026`)
  - falls back to `created_at`'s month last day if `period` can't be parsed
- Use it in place of the current `toLocaleDateString()` call.

## 2. "View / Download / Share" area → restyled to match the Start Staking "Your Position" box

Reference styling = the glowing gold card on `/portal/staking-plans` (the `Your Position` block: conic-gradient border halo, gold corner glow blobs, `liquid-glass` over `bg-gradient-to-br from-card/95 via-card/80`, gold-tinted shadow, `RuleEyebrow` divider rows, tight uppercase tracking labels).

Apply the same visual language to **each report card's action footer** (and lift the whole card to that aesthetic), so each card reads as its own "position" block:

- Wrap the card in the same `relative` + outer conic-gradient halo div used in staking-plans.
- Inner container: `border-gold/30`, gradient background, gold shadow, two corner glow blobs.
- Replace the inline button row with a **3-column stat-style grid** (mirrors the `Your Staking / Current Tier / Started Since` triad):
  - Column 1: **View** action (eye icon + uppercase eyebrow)
  - Column 2: **Download** action (download icon + eyebrow + file size as sub-text)
  - Column 3: **Share** action (placeholder — actual buttons rendered per #3)
- Use the same `RuleEyebrow` pattern (gold gradient hairlines + tiny uppercase label with icon) above each action.
- Title row keeps the gold serif gradient text already in use, plus the period/date eyebrow line.

Buttons themselves keep their existing handlers (open `file_url`, download), only their wrapper/visual treatment changes — no logic changes.

## 3. Share buttons → direct-jump, like landing page WhatsApp button

Currently Share is a `DropdownMenu` with 3 menu items. Replace with **inline direct-action buttons**, mirroring the landing page pattern (`src/routes/portal.landing-page.tsx` line 217-223 — single click → `window.open(...)`).

- Remove `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger` imports and usage.
- Render three small buttons side-by-side (Telegram / WhatsApp / WeChat), each styled like the landing page WhatsApp pill (brand-colored, icon + label, small):
  - **Telegram**: `bg-sky-500/90 text-white hover:bg-sky-500` → opens `https://t.me/share/url?url=...&text=...`
  - **WhatsApp**: `bg-emerald-500/90 text-white hover:bg-emerald-500` → opens `https://wa.me/?text=...`
  - **WeChat**: `bg-emerald-600/90 text-white hover:bg-emerald-600` → uses existing `navigator.share` / clipboard fallback (WeChat has no public share URL scheme on web, so this stays as copy-link with a toast — same behavior as today, just direct-click instead of being inside a dropdown)
- Each button is a single click → opens immediately in a new tab, no menu in between.

## Files touched

- `src/routes/portal.monthly-report.tsx` — only file modified

## Out of scope

- No translation key changes (existing keys reused; new labels added inline with `t(..., "fallback")`).
- No DB / RLS / server changes.
- No edits to `/portal/landing-page` or `/portal/staking-plans` themselves.
