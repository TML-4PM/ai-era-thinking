-- Create media_assets table for storing image metadata and attribution
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  source_api TEXT NOT NULL DEFAULT 'openverse',
  title TEXT,
  creator TEXT,
  license TEXT NOT NULL,
  license_url TEXT,
  attribution TEXT NOT NULL,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-covers', 'book-covers', true);

-- Enable RLS on media_assets
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to media_assets (for attribution display)
CREATE POLICY "Public read access for media assets" 
ON public.media_assets 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert/update media assets
CREATE POLICY "Authenticated users can manage media assets" 
ON public.media_assets 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Storage policies for book-covers bucket
CREATE POLICY "Public read access for book covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can upload book covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update book covers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_media_assets_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_media_assets_timestamp();