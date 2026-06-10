CREATE OR REPLACE FUNCTION public.grade_quiz(_answers jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;

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
$function$;