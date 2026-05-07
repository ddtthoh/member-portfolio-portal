
CREATE TABLE public.deposit_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  network TEXT NOT NULL DEFAULT 'BSC',
  network_label TEXT NOT NULL DEFAULT 'BNB Smart Chain (BEP20)',
  wallet_address TEXT NOT NULL DEFAULT '',
  qr_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deposit_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deposit settings" ON public.deposit_settings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own deposit settings" ON public.deposit_settings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own deposit settings" ON public.deposit_settings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own deposit settings" ON public.deposit_settings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('deposit-qr', 'deposit-qr', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read deposit qr" ON storage.objects
  FOR SELECT USING (bucket_id = 'deposit-qr');
CREATE POLICY "Users upload own deposit qr" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'deposit-qr' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own deposit qr" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'deposit-qr' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own deposit qr" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'deposit-qr' AND auth.uid()::text = (storage.foldername(name))[1]);
