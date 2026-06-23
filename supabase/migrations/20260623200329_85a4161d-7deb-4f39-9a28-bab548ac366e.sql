
-- Part 1: Sponsor binding on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sponsor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_sponsor_id ON public.profiles(sponsor_id);

-- Immutability trigger: sponsor_id cannot change once set
CREATE OR REPLACE FUNCTION public.lock_sponsor_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.sponsor_id IS NOT NULL AND NEW.sponsor_id IS DISTINCT FROM OLD.sponsor_id THEN
    RAISE EXCEPTION 'sponsor_id is immutable once set';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lock_sponsor_id ON public.profiles;
CREATE TRIGGER trg_lock_sponsor_id BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.lock_sponsor_id();

-- Updated handle_new_user: resolve sponsor account_number -> user id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sponsor_code text := NULLIF(new.raw_user_meta_data->>'sponsor_member_id', '');
  _sponsor_uid  uuid;
BEGIN
  IF _sponsor_code IS NOT NULL THEN
    SELECT id INTO _sponsor_uid FROM public.profiles WHERE account_number = _sponsor_code;
  END IF;

  INSERT INTO public.profiles (id, full_name, sponsor_id)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    _sponsor_uid
  );

  INSERT INTO public.wallets (user_id) VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- Public referral validation function (security definer, exposes only minimal data)
CREATE OR REPLACE FUNCTION public.validate_referral_code(_code text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _name text;
BEGIN
  IF _code IS NULL OR length(trim(_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false);
  END IF;
  SELECT full_name INTO _name FROM public.profiles WHERE account_number = trim(_code) LIMIT 1;
  IF _name IS NULL THEN
    RETURN jsonb_build_object('valid', false);
  END IF;
  RETURN jsonb_build_object('valid', true, 'sponsor_name', _name);
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_referral_code(text) TO anon, authenticated;

-- Part 2: Provision admin account for ddtthoh@gmail.com
DO $$
DECLARE
  _uid uuid;
  _email text := 'ddtthoh@gmail.com';
  _password text := 'Naslab@Admin2026';
BEGIN
  SELECT id INTO _uid FROM auth.users WHERE email = _email;

  IF _uid IS NULL THEN
    _uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', _uid, 'authenticated', 'authenticated',
      _email, crypt(_password, gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', 'Admin'),
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), _uid, jsonb_build_object('sub', _uid::text, 'email', _email), 'email', _uid::text, now(), now(), now());
  END IF;

  -- Grant admin role
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
