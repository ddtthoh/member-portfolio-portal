
DROP POLICY IF EXISTS "Public read deposit qr" ON storage.objects;
CREATE POLICY "Users list own deposit qr" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'deposit-qr' AND auth.uid()::text = (storage.foldername(name))[1]);
