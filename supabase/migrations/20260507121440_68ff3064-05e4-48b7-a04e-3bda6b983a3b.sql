ALTER TABLE public.wallets
  ADD COLUMN staking_balance NUMERIC NOT NULL DEFAULT 0;