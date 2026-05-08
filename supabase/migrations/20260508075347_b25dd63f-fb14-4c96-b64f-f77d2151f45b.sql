
-- Withdrawal wallets (saved addresses)
CREATE TABLE public.withdrawal_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  wallet_name text NOT NULL,
  wallet_address text NOT NULL,
  chain text NOT NULL DEFAULT 'BEP20',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawal_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own withdrawal wallets select" ON public.withdrawal_wallets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own withdrawal wallets insert" ON public.withdrawal_wallets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own withdrawal wallets update" ON public.withdrawal_wallets
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own withdrawal wallets delete" ON public.withdrawal_wallets
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Withdrawals
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reference_number text NOT NULL DEFAULT ('WDR' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 14))),
  wallet_id uuid REFERENCES public.withdrawal_wallets(id) ON DELETE SET NULL,
  recipient_address text NOT NULL,
  chain text NOT NULL DEFAULT 'BEP20',
  amount numeric NOT NULL,
  admin_fee numeric NOT NULL DEFAULT 0,
  receive_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  remark text,
  transaction_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own withdrawals select" ON public.withdrawals
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own withdrawals insert" ON public.withdrawals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_withdrawal_wallets_user ON public.withdrawal_wallets(user_id);
CREATE INDEX idx_withdrawals_user ON public.withdrawals(user_id);
