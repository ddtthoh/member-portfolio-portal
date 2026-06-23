
-- ============ Roles ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ Staking plans ============
CREATE TYPE public.plan_tier AS ENUM ('standard', 'advance', 'premium');
CREATE TYPE public.plan_variant AS ENUM ('lite', 'plus', 'pro');

CREATE TABLE public.staking_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier public.plan_tier NOT NULL,
  variant public.plan_variant NOT NULL,
  name text NOT NULL,
  stake_amount numeric(18,2) NOT NULL,
  base_daily_rate numeric(8,6) NOT NULL,  -- e.g. 0.002 = 0.20%
  team_level_cap int NOT NULL,
  referral_rate numeric(5,4) NOT NULL,    -- e.g. 0.06 = 6%
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tier, variant)
);

GRANT SELECT ON public.staking_plans TO authenticated, anon;
GRANT ALL ON public.staking_plans TO service_role;
ALTER TABLE public.staking_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can view active plans" ON public.staking_plans
  FOR SELECT USING (is_active = true);

-- Seed 9 plans
INSERT INTO public.staking_plans (tier, variant, name, stake_amount, base_daily_rate, team_level_cap, referral_rate) VALUES
  ('standard','lite','Standard Lite',     100,    0.002, 3,  0.06),
  ('standard','plus','Standard Plus',     300,    0.002, 3,  0.06),
  ('standard','pro', 'Standard Pro',      500,    0.002, 3,  0.06),
  ('advance', 'lite','Advance Lite',     1000,    0.003, 4,  0.08),
  ('advance', 'plus','Advance Plus',     3000,    0.003, 5,  0.08),
  ('advance', 'pro', 'Advance Pro',      5000,    0.003, 6,  0.08),
  ('premium', 'lite','Premium Lite',    10000,    0.004, 7,  0.10),
  ('premium', 'plus','Premium Plus',    30000,    0.004, 10, 0.10),
  ('premium', 'pro', 'Premium Pro',     50000,    0.004, 15, 0.10);

-- ============ Subscriptions ============
CREATE TYPE public.subscription_status AS ENUM ('active', 'terminated', 'upgraded');

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.staking_plans(id),
  stake_amount numeric(18,2) NOT NULL,
  status public.subscription_status NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  terminated_at timestamptz,
  total_profit numeric(18,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_idx ON public.subscriptions(user_id);
CREATE INDEX subscriptions_active_idx ON public.subscriptions(status) WHERE status = 'active';

GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own subscriptions select" ON public.subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- inserts go through subscribe_to_plan(); no direct insert policy needed

-- ============ Daily rates (admin input) ============
CREATE TABLE public.daily_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.staking_plans(id),
  rate_date date NOT NULL,
  rate numeric(8,6) NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, rate_date)
);

GRANT SELECT ON public.daily_rates TO authenticated;
GRANT ALL ON public.daily_rates TO service_role;
ALTER TABLE public.daily_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone authed can view rates" ON public.daily_rates
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage rates" ON public.daily_rates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ Daily profits ============
CREATE TABLE public.daily_profits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profit_date date NOT NULL,
  rate numeric(8,6) NOT NULL,
  stake_amount numeric(18,2) NOT NULL,
  profit_amount numeric(18,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, profit_date)
);

CREATE INDEX daily_profits_user_date_idx ON public.daily_profits(user_id, profit_date DESC);

GRANT SELECT ON public.daily_profits TO authenticated;
GRANT ALL ON public.daily_profits TO service_role;
ALTER TABLE public.daily_profits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profits select" ON public.daily_profits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ subscribe_to_plan() atomic function ============
CREATE OR REPLACE FUNCTION public.subscribe_to_plan(_plan_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _user_id uuid := auth.uid();
  _stake numeric(18,2);
  _bal numeric(18,2);
  _sub_id uuid;
BEGIN
  IF _user_id IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;

  SELECT stake_amount INTO _stake FROM public.staking_plans WHERE id = _plan_id AND is_active = true;
  IF _stake IS NULL THEN RAISE EXCEPTION 'plan not found or inactive'; END IF;

  SELECT usd_balance INTO _bal FROM public.wallets WHERE user_id = _user_id FOR UPDATE;
  IF _bal IS NULL THEN RAISE EXCEPTION 'wallet not found'; END IF;
  IF _bal < _stake THEN RAISE EXCEPTION 'insufficient USDT balance: need %, have %', _stake, _bal; END IF;

  UPDATE public.wallets
     SET usd_balance = usd_balance - _stake,
         staking_balance = staking_balance + _stake,
         updated_at = now()
   WHERE user_id = _user_id;

  INSERT INTO public.subscriptions (user_id, plan_id, stake_amount)
  VALUES (_user_id, _plan_id, _stake)
  RETURNING id INTO _sub_id;

  INSERT INTO public.transactions (user_id, type, asset, amount, status)
  VALUES (_user_id, 'stake', 'USDT', _stake, 'completed');

  RETURN _sub_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.subscribe_to_plan(uuid) TO authenticated;

-- ============ run_daily_profits() — called by cron ============
CREATE OR REPLACE FUNCTION public.run_daily_profits(_target_date date DEFAULT CURRENT_DATE)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _count int := 0;
  _total numeric(18,2) := 0;
BEGIN
  WITH inserted AS (
    INSERT INTO public.daily_profits (subscription_id, user_id, profit_date, rate, stake_amount, profit_amount)
    SELECT s.id, s.user_id, _target_date, dr.rate, s.stake_amount,
           ROUND(s.stake_amount * dr.rate, 2)
      FROM public.subscriptions s
      JOIN public.daily_rates dr ON dr.plan_id = s.plan_id AND dr.rate_date = _target_date
     WHERE s.status = 'active'
       AND s.started_at::date <= _target_date
    ON CONFLICT (subscription_id, profit_date) DO NOTHING
    RETURNING user_id, subscription_id, profit_amount
  ),
  wallet_update AS (
    UPDATE public.wallets w
       SET rewards_balance = rewards_balance + agg.total,
           updated_at = now()
      FROM (SELECT user_id, SUM(profit_amount) total FROM inserted GROUP BY user_id) agg
     WHERE w.user_id = agg.user_id
    RETURNING w.user_id
  ),
  sub_update AS (
    UPDATE public.subscriptions s
       SET total_profit = total_profit + agg.total
      FROM (SELECT subscription_id, SUM(profit_amount) total FROM inserted GROUP BY subscription_id) agg
     WHERE s.id = agg.subscription_id
    RETURNING s.id
  )
  SELECT COUNT(*), COALESCE(SUM(profit_amount),0) INTO _count, _total FROM inserted;

  RETURN jsonb_build_object('date', _target_date, 'subscriptions_processed', _count, 'total_profit', _total);
END;
$$;

REVOKE ALL ON FUNCTION public.run_daily_profits(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_daily_profits(date) TO service_role;
