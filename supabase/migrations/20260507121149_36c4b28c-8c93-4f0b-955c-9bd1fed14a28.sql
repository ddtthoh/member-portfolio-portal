-- Wallets table: one row per user
CREATE TABLE public.wallets (
  user_id UUID NOT NULL PRIMARY KEY,
  usd_balance NUMERIC NOT NULL DEFAULT 0,
  rewards_balance NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own wallet select"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "own wallet insert"
  ON public.wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own wallet update"
  ON public.wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- Update handle_new_user to also create a wallet row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));

  insert into public.wallets (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$function$;

-- Backfill wallets for existing users
INSERT INTO public.wallets (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;