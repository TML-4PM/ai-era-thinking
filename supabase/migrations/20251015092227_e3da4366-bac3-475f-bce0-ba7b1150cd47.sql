-- Phase 1: Database Schema for Book Platform ↔ Research Hub Integration

-- 1. Add linking columns to research_papers table
ALTER TABLE public.research_papers 
ADD COLUMN IF NOT EXISTS book_exemplar_ids uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS book_sections text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS practical_applications text,
ADD COLUMN IF NOT EXISTS last_book_sync timestamp with time zone DEFAULT now();

COMMENT ON COLUMN public.research_papers.book_exemplar_ids IS 'Array of master_4500 exemplar IDs that reference this research';
COMMENT ON COLUMN public.research_papers.book_sections IS 'Array of book section slugs (e.g., thinking-engine/thinkers) where this research is applied';
COMMENT ON COLUMN public.research_papers.practical_applications IS 'Description of how this research is used in books';
COMMENT ON COLUMN public.research_papers.last_book_sync IS 'Last time this research was synced with book platform';

-- 2. Create book_research_links table for detailed linking
CREATE TABLE IF NOT EXISTS public.book_research_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug text NOT NULL,
  section_slug text,
  research_paper_id uuid REFERENCES public.research_papers(id) ON DELETE CASCADE,
  exemplar_id uuid,
  link_type text CHECK (link_type IN ('citation', 'reference', 'deep_dive', 'related', 'background')) DEFAULT 'related',
  context_note text,
  relevance_score integer CHECK (relevance_score BETWEEN 1 AND 10) DEFAULT 5,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE public.book_research_links IS 'Junction table linking books/sections to research papers with context';
COMMENT ON COLUMN public.book_research_links.link_type IS 'Type of link: citation (direct reference), reference (supporting), deep_dive (detailed exploration), related (tangential), background (foundational)';
COMMENT ON COLUMN public.book_research_links.relevance_score IS 'How relevant this research is to the book content (1-10)';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_book_research_links_book ON public.book_research_links(book_slug, section_slug);
CREATE INDEX IF NOT EXISTS idx_book_research_links_paper ON public.book_research_links(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_book_research_links_exemplar ON public.book_research_links(exemplar_id);
CREATE INDEX IF NOT EXISTS idx_master_4500_research_papers ON public.master_4500 USING GIN(research_paper_ids);
CREATE INDEX IF NOT EXISTS idx_research_papers_exemplars ON public.research_papers USING GIN(book_exemplar_ids);
CREATE INDEX IF NOT EXISTS idx_research_papers_sections ON public.research_papers USING GIN(book_sections);

-- 3. Create trigger function to update timestamps
CREATE OR REPLACE FUNCTION public.update_book_research_links_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS update_book_research_links_timestamp_trigger ON public.book_research_links;
CREATE TRIGGER update_book_research_links_timestamp_trigger
  BEFORE UPDATE ON public.book_research_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_book_research_links_timestamp();

-- 4. Create function to sync research papers when exemplar is updated
CREATE OR REPLACE FUNCTION public.sync_exemplar_to_research()
RETURNS TRIGGER AS $$
DECLARE
  paper_id uuid;
BEGIN
  -- When research_paper_ids are added to an exemplar, update the research_papers table
  IF NEW.research_paper_ids IS DISTINCT FROM OLD.research_paper_ids THEN
    -- Add this exemplar to each linked research paper
    FOREACH paper_id IN ARRAY NEW.research_paper_ids
    LOOP
      UPDATE public.research_papers
      SET 
        book_exemplar_ids = array_append(
          COALESCE(book_exemplar_ids, '{}'), 
          NEW.id
        ),
        book_sections = array_append(
          COALESCE(book_sections, '{}'),
          NEW.book_slug || '/' || NEW.section_slug
        ),
        last_book_sync = now()
      WHERE id = paper_id
      AND NOT (NEW.id = ANY(COALESCE(book_exemplar_ids, '{}')));
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for exemplar updates
DROP TRIGGER IF EXISTS sync_exemplar_to_research_trigger ON public.master_4500;
CREATE TRIGGER sync_exemplar_to_research_trigger
  AFTER UPDATE OF research_paper_ids ON public.master_4500
  FOR EACH ROW
  WHEN (NEW.research_paper_ids IS DISTINCT FROM OLD.research_paper_ids)
  EXECUTE FUNCTION public.sync_exemplar_to_research();

-- 5. Create function to sync research papers when they're updated
CREATE OR REPLACE FUNCTION public.sync_research_to_exemplar()
RETURNS TRIGGER AS $$
DECLARE
  exemplar_id uuid;
BEGIN
  -- When book_exemplar_ids are added to a research paper, update master_4500
  IF NEW.book_exemplar_ids IS DISTINCT FROM OLD.book_exemplar_ids THEN
    FOREACH exemplar_id IN ARRAY NEW.book_exemplar_ids
    LOOP
      UPDATE public.master_4500
      SET 
        research_paper_ids = array_append(
          COALESCE(research_paper_ids, '{}'),
          NEW.id
        ),
        updated_at = now()
      WHERE id = exemplar_id
      AND NOT (NEW.id = ANY(COALESCE(research_paper_ids, '{}')));
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for research paper updates
DROP TRIGGER IF EXISTS sync_research_to_exemplar_trigger ON public.research_papers;
CREATE TRIGGER sync_research_to_exemplar_trigger
  AFTER UPDATE OF book_exemplar_ids ON public.research_papers
  FOR EACH ROW
  WHEN (NEW.book_exemplar_ids IS DISTINCT FROM OLD.book_exemplar_ids)
  EXECUTE FUNCTION public.sync_research_to_exemplar();

-- Enable RLS on book_research_links
ALTER TABLE public.book_research_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for book_research_links
CREATE POLICY "Public read access for book_research_links"
  ON public.book_research_links
  FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for book_research_links"
  ON public.book_research_links
  FOR ALL
  USING (has_role('admin'));

-- Add to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.book_research_links;