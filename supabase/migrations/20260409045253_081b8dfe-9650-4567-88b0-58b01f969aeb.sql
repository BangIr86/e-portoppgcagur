-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  profile_data JSONB DEFAULT '{}'::jsonb,
  artefak_data JSONB DEFAULT '{}'::jsonb,
  model_guru_data JSONB DEFAULT '{}'::jsonb,
  lampiran_data JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolios"
ON public.portfolios FOR SELECT
USING (true);

CREATE POLICY "Users can create own portfolio"
ON public.portfolios FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
ON public.portfolios FOR UPDATE
USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-files', 'portfolio-files', true);

CREATE POLICY "Portfolio files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-files');

CREATE POLICY "Users can upload their own portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own portfolio files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_portfolios_updated_at
BEFORE UPDATE ON public.portfolios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();