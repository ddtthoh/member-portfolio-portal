
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 200
    AND char_length(message) BETWEEN 1 AND 5000
  );

CREATE TABLE public.career_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit career applications"
  ON public.career_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 200
    AND char_length(position) BETWEEN 1 AND 200
  );

CREATE TABLE public.collaboration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  partnership_type TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit collaboration requests"
  ON public.collaboration_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(organization) BETWEEN 1 AND 200
    AND char_length(contact_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 200
    AND char_length(message) BETWEEN 1 AND 5000
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('career-resumes', 'career-resumes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "anyone can upload resume"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'career-resumes');
