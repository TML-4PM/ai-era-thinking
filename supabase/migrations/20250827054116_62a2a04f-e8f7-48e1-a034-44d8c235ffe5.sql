-- Create missing expanded_thinker_profiles table for deep profile storage
CREATE TABLE IF NOT EXISTS public.expanded_thinker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_name TEXT NOT NULL UNIQUE,
  thinker_area TEXT,
  core_idea TEXT,
  ai_shift TEXT,
  lobe TEXT,
  ai_relevance TEXT,
  usage_prompts TEXT[],
  related_thinkers TEXT[],
  practical_applications TEXT[],
  cross_era_relevance TEXT,
  implementation_timeline JSONB,
  industries TEXT[],
  processing_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expanded_thinker_profiles ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Public read access for expanded_thinker_profiles"
  ON public.expanded_thinker_profiles
  FOR SELECT
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_expanded_thinker_profiles_updated_at
  BEFORE UPDATE ON public.expanded_thinker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_timestamp();

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_expanded_thinker_profiles_name 
  ON public.expanded_thinker_profiles (thinker_name);

-- Ensure neural_ennead_families table has required data structure
CREATE TABLE IF NOT EXISTS public.neural_ennead_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code TEXT NOT NULL UNIQUE,
  family_name TEXT NOT NULL,
  description TEXT,
  canonical_keywords TEXT[],
  exemplar_roles TEXT[],
  source_urls TEXT[],
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for neural_ennead_families
ALTER TABLE public.neural_ennead_families ENABLE ROW LEVEL SECURITY;

-- Create public read policy for neural_ennead_families
CREATE POLICY "Public read access for neural_ennead_families"
  ON public.neural_ennead_families
  FOR SELECT
  USING (true);

-- Seed the 9 core Neural Ennead families if they don't exist
INSERT INTO public.neural_ennead_families (family_code, family_name, description, canonical_keywords, exemplar_roles) VALUES
  ('AHC', 'Augmented Humanity Coach', 'Guides human-AI collaboration and capability enhancement', ARRAY['coaching', 'human-ai', 'augmentation', 'collaboration'], ARRAY['AI Coach', 'Human Enhancement Specialist', 'Collaboration Facilitator']),
  ('DIG', 'Digital Innovation Guide', 'Leads digital transformation and innovation initiatives', ARRAY['innovation', 'digital', 'transformation', 'technology'], ARRAY['Innovation Director', 'Digital Strategist', 'Technology Leader']),
  ('SYS', 'Systems Thinking Specialist', 'Analyzes complex systems and interdependencies', ARRAY['systems', 'complexity', 'analysis', 'integration'], ARRAY['Systems Analyst', 'Integration Specialist', 'Complexity Manager']),
  ('ETH', 'Ethics & Governance Expert', 'Ensures responsible AI development and deployment', ARRAY['ethics', 'governance', 'compliance', 'responsibility'], ARRAY['Ethics Officer', 'Governance Specialist', 'Compliance Manager']),
  ('DATA', 'Data Intelligence Analyst', 'Transforms data into actionable insights', ARRAY['data', 'analytics', 'intelligence', 'insights'], ARRAY['Data Scientist', 'Analytics Expert', 'Intelligence Analyst']),
  ('UX', 'User Experience Architect', 'Designs human-centered AI interactions', ARRAY['user-experience', 'design', 'interaction', 'human-centered'], ARRAY['UX Designer', 'Interaction Designer', 'Experience Architect']),
  ('STRAT', 'Strategic Planning Catalyst', 'Develops and executes strategic initiatives', ARRAY['strategy', 'planning', 'execution', 'catalyst'], ARRAY['Strategic Planner', 'Business Strategist', 'Planning Director']),
  ('ADAPT', 'Adaptive Learning Facilitator', 'Enables continuous learning and adaptation', ARRAY['learning', 'adaptation', 'continuous', 'facilitation'], ARRAY['Learning Specialist', 'Adaptation Coach', 'Training Director']),
  ('BRIDGE', 'Cross-Functional Bridge', 'Connects different domains and stakeholders', ARRAY['bridge', 'cross-functional', 'connection', 'stakeholder'], ARRAY['Bridge Specialist', 'Integration Manager', 'Stakeholder Coordinator'])
ON CONFLICT (family_code) DO NOTHING;