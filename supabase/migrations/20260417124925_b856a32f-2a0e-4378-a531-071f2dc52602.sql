ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS portfolios_slug_unique ON public.portfolios(slug) WHERE slug IS NOT NULL;