ALTER TABLE public.kyc_submissions
  ADD COLUMN IF NOT EXISTS doc_type text NOT NULL DEFAULT 'passport',
  ADD COLUMN IF NOT EXISTS back_url text;

ALTER TABLE public.kyc_submissions
  DROP CONSTRAINT IF EXISTS kyc_doc_type_check;

ALTER TABLE public.kyc_submissions
  ADD CONSTRAINT kyc_doc_type_check CHECK (doc_type IN ('identity_card','passport'));