-- Phase 4: Reader Experience - Add chapter publishing and metadata
ALTER TABLE public.book_chapters 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS word_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS est_read_minutes integer DEFAULT 0;

-- Create chapter status enum for Phase 6
CREATE TYPE chapter_status AS ENUM ('draft', 'outline', 'writing', 'review', 'edited', 'approved', 'published');

ALTER TABLE public.book_chapters 
ADD COLUMN IF NOT EXISTS chapter_status chapter_status DEFAULT 'draft';

-- Phase 4: Public RLS policies for books
CREATE POLICY "Public can read published books" 
ON public.books 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Public can read published chapters" 
ON public.book_chapters 
FOR SELECT 
USING (is_published = true AND EXISTS (
  SELECT 1 FROM public.books 
  WHERE books.id = book_chapters.book_id 
  AND books.status = 'published'
));

-- Phase 5: Create Storage bucket for book assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('book-assets', 'book-assets', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Phase 5: Storage policies for book assets
CREATE POLICY "Public can view book assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'book-assets');

CREATE POLICY "Admins can upload book assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'book-assets' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update book assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'book-assets' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can delete book assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'book-assets' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Phase 6: Book comments table for collaboration
CREATE TABLE public.book_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on book_comments
ALTER TABLE public.book_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for comments
CREATE POLICY "Admins can manage all comments" 
ON public.book_comments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Phase 6: Book activity table for tracking changes
CREATE TABLE public.book_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on book_activity
ALTER TABLE public.book_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity
CREATE POLICY "Admins can view all activity" 
ON public.book_activity 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can insert their own activity" 
ON public.book_activity 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Phase 7: Atomic chapter reordering function
CREATE OR REPLACE FUNCTION public.reorder_book_chapters(
  p_book_id uuid,
  p_chapter_ids uuid[]
) 
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  chapter_id uuid;
  new_order integer := 1;
BEGIN
  -- Validate that all chapters belong to the book
  IF EXISTS (
    SELECT 1 FROM public.book_chapters 
    WHERE id = ANY(p_chapter_ids) AND book_id != p_book_id
  ) THEN
    RAISE EXCEPTION 'All chapters must belong to the specified book';
  END IF;
  
  -- Update chapter order atomically
  FOREACH chapter_id IN ARRAY p_chapter_ids LOOP
    UPDATE public.book_chapters 
    SET chapter_order = new_order, updated_at = now()
    WHERE id = chapter_id AND book_id = p_book_id;
    new_order := new_order + 1;
  END LOOP;
END;
$$;

-- Add trigger for updating book_comments timestamp
CREATE OR REPLACE FUNCTION public.update_book_comments_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_comments_timestamp
BEFORE UPDATE ON public.book_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_book_comments_timestamp();