## Goal

Make the wallet balances dynamic and shared across the portal so editing one
value updates every place it appears (Est. Total Value hero, USD/Rewards
wallet cards on `/portal`, and the gauge on `/portal/asset-analysis`).

## Single source of truth

Add a per-user `wallets` row in the database with two balances:

- `usd_balance`
- `rewards_balance`

Total Value is always derived as `usd_balance + rewards_balance` — no separate
field, so it can never drift out of sync.

## Database changes

New table `public.wallets`:

```text
wallets
  user_id           uuid  PRIMARY KEY  (one row per user)
  usd_balance       numeric  NOT NULL  DEFAULT 0
  rewards_balance   numeric  NOT NULL  DEFAULT 0
  updated_at        timestamptz NOT NULL DEFAULT now()
```

- RLS enabled. Policy: users can SELECT/UPDATE/INSERT only their own row
  (`auth.uid() = user_id`).
- Update the existing `handle_new_user()` trigger function so a wallet row
  is auto-created alongside the profile when a user signs up.
- Backfill: insert a wallet row for any existing user that doesn't have one
  (defaults to 0 / 0).

## Server function

New file `src/lib/wallet.functions.ts`:

- `getWallet()` — protected with `requireSupabaseAuth`, returns
  `{ usd: number, rewards: number, total: number }` for the signed-in user.
  If no row exists, returns zeros.

(We can add `updateWallet` later when an admin/edit UI is needed — out of
scope for this step since the user just wants the read side wired up.)

## Frontend wiring

Use TanStack Query so all three consumers share the same cache key
(`["wallet"]`) and update together.

1. `src/routes/portal.index.tsx`
   - Loader: `ensureQueryData` for the wallet.
   - Hero "Est. Total Value": replace hardcoded `50000` with `total` from the
     query (still passed through `<CountUp>`, hide-balance toggle preserved).
   - USD Wallet / Rewards Wallet cards: replace hardcoded `0` / `0` with
     `usd` and `rewards` from the query.

2. `src/routes/portal.asset-analysis.tsx`
   - Loader: same `ensureQueryData`.
   - Replace the hardcoded `<TotalAssetsGauge usd={488.6} rewards={209.4} />`
     with values from the query. Gauge animation behavior is unchanged.

3. Sparkline on the hero stays as-is for now (it's illustrative trend data,
   not a live series). We can wire it to a real history table later.

## Out of scope (ask if you want them next)

- An edit UI / admin page to change balances (right now they'd be set via
  the DB or a future admin tool).
- Linking transactions/deposits/withdrawals to actually mutate the wallet
  balance — that's the natural next step once this read path works.

## Technical notes

- Loaders are isomorphic in TanStack Start, so the Supabase call lives in a
  `createServerFn` with `requireSupabaseAuth`, not directly in the loader.
- Both routes need a `beforeLoad` gate using `supabase.auth.getUser()` so the
  bearer token is hydrated before the server function runs (otherwise the
  first paint 401s).
- Both routes get a small `errorComponent` and the loader returns zeros on
  failure so the UI never hard-crashes if the wallet row is missing.
