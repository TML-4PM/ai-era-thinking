-- Add missing fields to books table
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS collection text DEFAULT 'Tech for Humanity',
ADD COLUMN IF NOT EXISTS owner text,
ADD COLUMN IF NOT EXISTS due_date date,
ADD COLUMN IF NOT EXISTS draft_url text,
ADD COLUMN IF NOT EXISTS ready_flag boolean DEFAULT false;

-- Create book-drafts storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-drafts', 'book-drafts', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for book-drafts
CREATE POLICY "Authenticated users can view book drafts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'book-drafts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload book drafts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'book-drafts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update book drafts" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'book-drafts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete book drafts" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'book-drafts' AND auth.role() = 'authenticated');