-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  lead_description TEXT,
  cover_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'writing', 'review', 'published')),
  series_name TEXT DEFAULT 'Tech for Humanity',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book chapters table
CREATE TABLE public.book_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  chapter_order INTEGER NOT NULL,
  sections JSONB DEFAULT '[]'::jsonb,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, chapter_order)
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Books are publicly readable" 
ON public.books 
FOR SELECT 
USING (true);

CREATE POLICY "Book chapters are publicly readable" 
ON public.book_chapters 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_books_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_books_timestamp();

CREATE TRIGGER update_book_chapters_updated_at
BEFORE UPDATE ON public.book_chapters
FOR EACH ROW
EXECUTE FUNCTION public.update_books_timestamp();

-- Insert sample data
INSERT INTO public.books (title, subtitle, slug, lead_description, cover_url, status, progress_percentage) VALUES
('WorkFamilyAI', 'Tech for Humanity', 'workfamilyai', 'Practical AI systems for work, home, and community.', '/assets/covers/workfamilyai.jpg', 'writing', 53),
('Sovereign Systems', 'Tech for Humanity', 'sovereign-systems', 'Open, interoperable, citizen-first digital infrastructure.', '/assets/covers/sovereign-systems.jpg', 'draft', 27),
('The Time Tree', 'Tech for Humanity', 'the-time-tree', 'Time-aware planning across families, teams, and cities.', '/assets/covers/time-tree.jpg', 'writing', 32);

-- Insert chapters for WorkFamilyAI
INSERT INTO public.book_chapters (book_id, title, chapter_order, sections, progress_percentage) VALUES
((SELECT id FROM public.books WHERE slug = 'workfamilyai'), 'Foundations', 1, '["Principles", "Safety", "Agent Roles"]'::jsonb, 65),
((SELECT id FROM public.books WHERE slug = 'workfamilyai'), 'Household Agents', 2, '["Scheduling", "Care", "Finance"]'::jsonb, 40),
((SELECT id FROM public.books WHERE slug = 'workfamilyai'), 'Org Agents', 3, '["PMO", "Ops", "Compliance"]'::jsonb, 55);

-- Insert chapters for Sovereign Systems
INSERT INTO public.book_chapters (book_id, title, chapter_order, sections, progress_percentage) VALUES
((SELECT id FROM public.books WHERE slug = 'sovereign-systems'), 'Civic Stack', 1, '["Identity", "Data Commons", "GovOps"]'::jsonb, 35),
((SELECT id FROM public.books WHERE slug = 'sovereign-systems'), 'Markets', 2, '["Payments", "Auditability", "Standards"]'::jsonb, 20),
((SELECT id FROM public.books WHERE slug = 'sovereign-systems'), 'Resilience', 3, '["Continuity", "Security", "Localism"]'::jsonb, 25);

-- Insert chapters for The Time Tree
INSERT INTO public.book_chapters (book_id, title, chapter_order, sections, progress_percentage) VALUES
((SELECT id FROM public.books WHERE slug = 'the-time-tree'), 'Time Graph', 1, '["Nodes", "Edges", "Calendars"]'::jsonb, 50),
((SELECT id FROM public.books WHERE slug = 'the-time-tree'), 'Predictions', 2, '["Signals", "Trajectories", "Risk"]'::jsonb, 30),
((SELECT id FROM public.books WHERE slug = 'the-time-tree'), 'Execution', 3, '["Rituals", "Cadence", "Feedback"]'::jsonb, 15);