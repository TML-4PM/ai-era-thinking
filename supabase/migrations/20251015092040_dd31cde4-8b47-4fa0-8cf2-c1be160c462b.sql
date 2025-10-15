-- Add research linking column to master_4500 for bidirectional sync with Research Hub
ALTER TABLE public.master_4500 
ADD COLUMN IF NOT EXISTS research_paper_ids uuid[] DEFAULT '{}';

COMMENT ON COLUMN public.master_4500.research_paper_ids IS 'Array of research paper IDs from research_papers table that back this exemplar';