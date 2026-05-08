
# Withdrawal Module — Complete Plan

Rebuild `/portal/withdrawal` into a single, premium page matching the visual language of `/portal/deposit` (liquid-glass cards, gold gradient accents, motion, mono tabular fonts). All sub-flows live on the same page via collapsible sections + dialogs — no extra subroutes needed (consistent with how Deposit handles its flow).

## Page Layout (single route: `/portal/withdrawal`)

```text
PageHeader  "Withdrawal"
│
├─ ⚠ Important Reminder banner (amber, same style as deposit page)
│   • Only USDT via BSC (BEP20). Wrong network = permanent loss.
│   • Withdrawals processed within X minutes after approval.
│
├─ SECTION 1 — Withdrawal Wallets       [+ Add Wallet button]
│   liquid-glass card · table of saved wallets
│   columns: Date · Wallet Name · Wallet Address (mono, head…tail) · Action (edit/delete)
│   Empty state: "No wallets yet — add one to start withdrawing."
│   "Add Wallet" opens a Dialog (modal) — see Form A
│
├─ SECTION 2 — New Withdrawal Request
│   liquid-glass card · 2-column on desktop, stacked on mobile
│   Left: form (Form B)
│   Right: live summary panel (USD Credit balance + computed Admin Fee + Total)
│
├─ SECTION 3 — Filter Transactions  (collapsible, identical pattern to deposit)
│   Date · Reference Number · Recipient Address · Transaction Hash · Status select · Currency Type (locked: USDT BEP20)
│   Apply / Reset buttons (gold gradient + outline)
│
└─ SECTION 4 — Withdrawal History
    liquid-glass card · header with History icon + Live pill + [Export Excel] button
    Horizontally scrollable ledger with columns:
    Date · Reference Number · Recipient Address · USDT Chain · Withdrawal Amount ·
    Admin Fee · You'll Receive · Status (badge) · Remark · Transaction Hash (copy on click)
```

## Forms

**Form A — Add / Edit Wallet (Dialog)**
- Credit Type: locked select showing `USDT (BEP20)` — disabled
- Wallet Name: text input, required, max 40 chars (e.g. "Finance", "Personal")
- Wallet Address: text input, placeholder `0x...`, required, validated `^0x[a-fA-F0-9]{40}$`
- Submit button: gold gradient

**Form B — New Withdrawal Request**
- Credit Type: locked `USDT (BEP20)`
- Wallet Address: select dropdown sourced from saved wallets only.
  - If empty → disabled with helper "Add a wallet first" + inline link to Section 1
  - No manual paste / typing
- Amount: numeric input, validates ≤ available USD credit, min 10
- Live computed (right panel + below input):
  - Admin Fee = `max(1, amount * 0.02)` (configurable constant)
  - You'll Receive = amount − fee
  - Total Withdrawal Amount = amount (gold highlighted)
- Submit "Request Withdrawal" → confirmation dialog → insert row → toast → reset form

## Export (Section 4 button)

"Export Excel" button (top-right of history card, outline + gold hover).
- Generates `.xlsx` client-side via `xlsx` (SheetJS) — no backend needed.
- Filename: `withdrawal-history-YYYY-MM-DD.xlsx`
- Exports the currently filtered rows with all visible columns.

## Database (Lovable Cloud)

Two new tables — both with RLS `auth.uid() = user_id`.

**`withdrawal_wallets`**
- `id`, `user_id`, `wallet_name`, `wallet_address`, `chain` (default `BEP20`), `created_at`

**`withdrawals`**
- `id`, `user_id`, `reference_number` (default `WDR…`), `wallet_id` (fk), `recipient_address`, `chain` (default `BEP20`), `amount`, `admin_fee`, `receive_amount`, `status` (`pending|processing|completed|rejected`, default `pending`), `remark`, `transaction_hash`, `created_at`

RLS: users can SELECT/INSERT own; UPDATE/DELETE only on `withdrawal_wallets`. Withdrawals are insert-only by user (status managed server-side later).

## Styling Notes (must match `/portal` system)

- Use `PageHeader`, `SpotlightCard`, `liquid-glass`, `Input`, `Button`, `Dialog` from existing components.
- Headings: `font-serif text-gold`, eyebrows `text-[11px] uppercase tracking-[0.2em] text-muted-foreground`.
- Address rendering: `font-mono`, head/tail in `text-gold`, middle muted.
- Status badges: completed = emerald, pending = amber, rejected = rose, processing = sky — pill with dot.
- Buttons: primary = `bg-gradient-to-r from-gold to-amber-400 text-black`; secondary = outline border + gold hover.
- Animations: `framer-motion` row stagger (delay i*0.03) — same as deposit history.

## Files to Touch

- `src/routes/portal.withdrawal.tsx` — full rewrite
- `src/routes/portal.withdrawal.wallets.tsx` — NOT created (kept as inline section + dialog for unified UX)
- New migration: `withdrawal_wallets` + `withdrawals` tables with RLS
- `package.json` — add `xlsx` dependency for export

## Why no subpages

Deposit already follows the "everything on one page" pattern (settings + history + filter). Splitting wallets/create/history into 3 routes would break consistency and force extra navigation. Dialogs handle Add/Edit Wallet cleanly; the rest is sectioned on one scroll.
