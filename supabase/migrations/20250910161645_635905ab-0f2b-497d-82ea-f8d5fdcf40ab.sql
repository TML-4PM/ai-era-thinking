-- Add new fields to book_user_contributions table
ALTER TABLE public.book_user_contributions 
ADD COLUMN progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
ADD COLUMN status text DEFAULT 'scaffold' CHECK (status IN ('scaffold', 'seeded', 'complete')),
ADD COLUMN notes text,
ADD COLUMN exemplar_key text;

-- Create index for better performance on exemplar-level contributions
CREATE INDEX idx_book_user_contributions_exemplar_key ON public.book_user_contributions(book_slug, exemplar_key) WHERE exemplar_key IS NOT NULL;