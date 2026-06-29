
-- 1. Revoke EXECUTE from PUBLIC on all SECURITY DEFINER functions; re-grant only where required
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.run_daily_profits(date) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.subscribe_to_plan(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_referral_code(text) FROM PUBLIC, anon, authenticated;

-- has_role is referenced inside RLS policies; only the policy evaluator needs it.
-- subscribe_to_plan is an RPC for signed-in users.
GRANT EXECUTE ON FUNCTION public.subscribe_to_plan(uuid) TO authenticated;
-- validate_referral_code is called by the signup form (pre-auth).
GRANT EXECUTE ON FUNCTION public.validate_referral_code(text) TO anon, authenticated;

-- 2. Broaden monthly_reports SELECT to all signed-in members
DROP POLICY IF EXISTS "users view own monthly reports" ON public.monthly_reports;
CREATE POLICY "authenticated view monthly reports"
  ON public.monthly_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Broaden monthly-reports storage bucket SELECT to all signed-in members
DROP POLICY IF EXISTS "owner read monthly-reports" ON storage.objects;
CREATE POLICY "authenticated read monthly-reports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'monthly-reports');
