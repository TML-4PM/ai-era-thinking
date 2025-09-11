-- Create enum for content status
CREATE TYPE public.content_status AS ENUM ('scaffold', 'seeded', 'complete');

-- Create the master_4500 table for "The Thinking Engine" canonical content
CREATE TABLE public.master_4500 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_slug TEXT NOT NULL DEFAULT 'thinking-engine',
  section_slug TEXT NOT NULL,
  exemplar_type TEXT NOT NULL,
  title TEXT NOT NULL,
  status content_status NOT NULL DEFAULT 'scaffold',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Core content fields
  description TEXT,
  core_framework TEXT,
  original_insight TEXT,
  ai_era_shift TEXT,
  ai_relevance TEXT,
  cross_era_evolution TEXT,
  
  -- Era mappings
  era_on_prem TEXT,
  era_cloud_native TEXT,
  era_gen_ai TEXT,
  era_agentic_ai TEXT,
  era_bci TEXT,
  
  -- Implementation timeline
  implementation_phase1 TEXT,
  implementation_phase2 TEXT,
  implementation_phase3 TEXT,
  
  -- Author statements
  author_original_insight TEXT,
  author_ai_era_shift TEXT,
  author_ai_relevance TEXT,
  
  -- Related content
  related_thinkers TEXT[],
  related_frameworks TEXT[],
  case_studies TEXT[],
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_master_4500_book_slug ON public.master_4500(book_slug);
CREATE INDEX idx_master_4500_section_slug ON public.master_4500(section_slug);
CREATE INDEX idx_master_4500_status ON public.master_4500(status);
CREATE INDEX idx_master_4500_progress ON public.master_4500(progress);

-- Create updated_at trigger
CREATE TRIGGER update_master_4500_updated_at
  BEFORE UPDATE ON public.master_4500
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_timestamp();

-- Enable Row Level Security
ALTER TABLE public.master_4500 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read seeded and complete content
CREATE POLICY "Public can view seeded and complete content"
ON public.master_4500
FOR SELECT
USING (status IN ('seeded', 'complete'));

-- Authenticated users can view all content
CREATE POLICY "Authenticated users can view all content"
ON public.master_4500
FOR SELECT
TO authenticated
USING (true);

-- Editors and admins can modify content
CREATE POLICY "Editors can modify content"
ON public.master_4500
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- Create a view for legacy naming compatibility
CREATE VIEW public."4500 Master" AS
SELECT * FROM public.master_4500;