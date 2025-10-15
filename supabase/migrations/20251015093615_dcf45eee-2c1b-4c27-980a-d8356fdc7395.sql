-- Phase 2B: ThinkerResearchService - Database Schema Updates

-- Add research tracking columns to thinker_profiles
ALTER TABLE public.thinker_profiles
ADD COLUMN IF NOT EXISTS research_paper_ids uuid[],
ADD COLUMN IF NOT EXISTS publication_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_research_sync timestamp with time zone;

-- Create GIN index on research_papers.authors for faster author name queries
CREATE INDEX IF NOT EXISTS idx_research_papers_authors 
ON public.research_papers USING GIN (authors);

-- Create index on thinker_profiles.research_paper_ids for faster lookups
CREATE INDEX IF NOT EXISTS idx_thinker_profiles_research_paper_ids
ON public.thinker_profiles USING GIN (research_paper_ids);

-- Add comment for documentation
COMMENT ON COLUMN public.thinker_profiles.research_paper_ids IS 'Array of research paper IDs authored by this thinker';
COMMENT ON COLUMN public.thinker_profiles.publication_count IS 'Total number of research papers by this thinker';
COMMENT ON COLUMN public.thinker_profiles.last_research_sync IS 'Last time research papers were synced for this thinker';