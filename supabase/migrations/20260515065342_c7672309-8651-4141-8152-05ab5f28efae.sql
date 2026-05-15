
-- 1. Wallets: remove self-insert and self-update (balances are server-managed)
DROP POLICY IF EXISTS "own wallet update" ON public.wallets;
DROP POLICY IF EXISTS "own wallet insert" ON public.wallets;

-- 2. Transactions: replace ALL with SELECT-only for end users
DROP POLICY IF EXISTS "own transactions" ON public.transactions;
CREATE POLICY "own transactions select"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Deposits: remove user INSERT (server-side only after verification)
DROP POLICY IF EXISTS "Users insert own deposits" ON public.deposits;

-- 4. Quiz questions: remove authenticated INSERT (admin/service-role only)
DROP POLICY IF EXISTS "auth insert questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "owner delete questions" ON public.quiz_questions;

-- 5. Monthly reports bucket: make private + require auth for SELECT
UPDATE storage.buckets SET public = false WHERE id = 'monthly-reports';
DROP POLICY IF EXISTS "public read monthly-reports" ON storage.objects;
CREATE POLICY "authenticated read monthly-reports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'monthly-reports');

-- Tighten upload policy: must be authenticated and own folder
DROP POLICY IF EXISTS "authenticated upload monthly-reports" ON storage.objects;
CREATE POLICY "authenticated upload monthly-reports"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'monthly-reports'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 6. Career resumes: require auth + namespaced path
DROP POLICY IF EXISTS "anyone can upload resume" ON storage.objects;
CREATE POLICY "authenticated upload own resume"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'career-resumes'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 7. Realtime: restrict wallet channel subscriptions to own user
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated can read own wallet realtime" ON realtime.messages;
CREATE POLICY "authenticated can read own wallet realtime"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (
    extension = 'postgres_changes'
    AND topic LIKE 'wallet-' || (auth.uid())::text || '-%'
  );
