
-- Lock down all SECURITY DEFINER functions from anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.subscribe_to_plan(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.subscribe_to_plan(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.run_daily_profits(date) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.run_daily_profits(date) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.grade_quiz(jsonb) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.grade_quiz(jsonb) TO authenticated;
