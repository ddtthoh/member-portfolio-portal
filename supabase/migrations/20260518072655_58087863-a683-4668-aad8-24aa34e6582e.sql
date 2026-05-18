
DROP POLICY IF EXISTS "owner read monthly-reports" ON storage.objects;
DROP POLICY IF EXISTS "owner delete monthly-reports" ON storage.objects;
DROP POLICY IF EXISTS "owner read career-resumes" ON storage.objects;
DROP POLICY IF EXISTS "owner delete career-resumes" ON storage.objects;

CREATE POLICY "owner read monthly-reports"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'monthly-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "owner delete monthly-reports"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'monthly-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "owner read career-resumes"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'career-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "owner delete career-resumes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'career-resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
