CREATE TABLE public.deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  reference_number text NOT NULL,
  transaction_hash text NOT NULL,
  amount numeric,
  asset text DEFAULT 'USDT',
  network text DEFAULT 'BEP20',
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deposits" ON public.deposits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own deposits" ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_deposits_user_received ON public.deposits(user_id, received_at DESC);