-- Create GCBAT Characters table
CREATE TABLE public.gcbat_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  background TEXT,
  character_arc TEXT,
  appearance TEXT,
  voice_style TEXT,
  relationships JSONB,
  gcbat_unit_alignment TEXT,
  portrait_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create GCBAT Character Appearances table (story-character many-to-many)
CREATE TABLE public.gcbat_character_appearances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_chapter_id UUID NOT NULL,
  character_id UUID NOT NULL REFERENCES public.gcbat_characters(id) ON DELETE CASCADE,
  appearance_type TEXT CHECK (appearance_type IN ('protagonist', 'supporting', 'cameo')),
  narrative_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(story_chapter_id, character_id)
);

-- Enable RLS
ALTER TABLE public.gcbat_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gcbat_character_appearances ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read gcbat characters"
  ON public.gcbat_characters FOR SELECT
  USING (true);

CREATE POLICY "Public read character appearances"
  ON public.gcbat_character_appearances FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admin write gcbat characters"
  ON public.gcbat_characters FOR ALL
  USING (has_role('admin'));

CREATE POLICY "Admin write character appearances"
  ON public.gcbat_character_appearances FOR ALL
  USING (has_role('admin'));

-- Create updated_at trigger
CREATE TRIGGER update_gcbat_characters_timestamp
  BEFORE UPDATE ON public.gcbat_characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_timestamp();

-- Insert the 9 Neural Ennead characters (placeholder data - to be updated with real character bibles)
INSERT INTO public.gcbat_characters (name, slug, role, gcbat_unit_alignment) VALUES
  ('Character 1', 'character-1', 'Governance Lead', 'Governance'),
  ('Character 2', 'character-2', 'Compliance Expert', 'Compliance'),
  ('Character 3', 'character-3', 'Business Strategist', 'Business'),
  ('Character 4', 'character-4', 'Architecture Lead', 'Architecture'),
  ('Character 5', 'character-5', 'Technology Specialist', 'Technology'),
  ('Character 6', 'character-6', 'Ethics Advisor', 'Governance'),
  ('Character 7', 'character-7', 'Risk Analyst', 'Compliance'),
  ('Character 8', 'character-8', 'Change Manager', 'Business'),
  ('Character 9', 'character-9', 'Systems Designer', 'Technology');