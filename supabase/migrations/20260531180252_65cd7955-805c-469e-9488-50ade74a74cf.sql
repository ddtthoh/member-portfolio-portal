-- 1. Make deposit-qr bucket private so QR codes are gated by RLS instead of being publicly enumerable.
UPDATE storage.buckets SET public = false WHERE id = 'deposit-qr';

-- 2. Restrict monthly_reports table reads to the owning uploader (no cross-user reads).
DROP POLICY IF EXISTS "anyone authenticated can view monthly reports" ON public.monthly_reports;
CREATE POLICY "users view own monthly reports"
  ON public.monthly_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- 3. Drop the over-permissive storage SELECT policy that let any authenticated user read every monthly-reports file.
DROP POLICY IF EXISTS "authenticated read monthly-reports" ON storage.objects;

-- 4. Hide quiz answer key (correct_index) from client SELECTs while keeping other columns readable.
REVOKE SELECT ON public.quiz_questions FROM anon, authenticated;
GRANT SELECT (id, category, question, options, created_by, created_at) ON public.quiz_questions TO authenticated;

-- Server-side grader so clients can score quizzes without ever reading correct_index up front.
CREATE OR REPLACE FUNCTION public.grade_quiz(_answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH submitted AS (
    SELECT (elem->>'question_id')::uuid AS qid,
           NULLIF(elem->>'selected','')::int AS selected
    FROM jsonb_array_elements(_answers) elem
  ),
  joined AS (
    SELECT s.qid,
           s.selected,
           q.correct_index,
           (s.selected IS NOT NULL AND s.selected = q.correct_index) AS is_correct
    FROM submitted s
    JOIN public.quiz_questions q ON q.id = s.qid
  )
  SELECT jsonb_build_object(
    'total', COUNT(*)::int,
    'score', COUNT(*) FILTER (WHERE is_correct)::int,
    'results', COALESCE(jsonb_agg(jsonb_build_object(
      'question_id', qid,
      'correct_index', correct_index,
      'selected', selected,
      'is_correct', is_correct
    )), '[]'::jsonb)
  ) INTO result
  FROM joined;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.grade_quiz(jsonb) TO authenticated;