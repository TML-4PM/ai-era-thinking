-- Fix 1: Ensure the correct tables exist with proper structure and data
-- Check and create neural_ennead_families if needed (should already exist)
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

-- Ensure neural_ennead_members table exists with proper structure (should already exist)
CREATE TABLE IF NOT EXISTS public.neural_ennead_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  exemplar_roles TEXT[],
  primary_family_code TEXT NOT NULL,
  secondary_family_code TEXT,
  tertiary_family_code TEXT,
  canonical_keywords TEXT[],
  processing_notes TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure thinker_profiles table exists (should already exist)
CREATE TABLE IF NOT EXISTS public.thinker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_name TEXT NOT NULL UNIQUE,
  area TEXT,
  core_idea TEXT,
  ai_shift TEXT,
  lobe TEXT,
  cross_era_relevance JSONB,
  usage_prompts JSONB,
  practical_applications JSONB,
  related_thinkers TEXT[],
  industries TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies to all tables
ALTER TABLE public.neural_ennead_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neural_ennead_members ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.thinker_profiles ENABLE ROW LEVEL SECURITY;

-- Create public read policies for all tables
CREATE POLICY "Public read access for neural_ennead_families"
  ON public.neural_ennead_families
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for neural_ennead_members"
  ON public.neural_ennead_members
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for thinker_profiles"
  ON public.thinker_profiles
  FOR SELECT
  USING (true);

-- Create update triggers for timestamp management
CREATE OR REPLACE FUNCTION public.update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_neural_ennead_families_updated_at
  BEFORE UPDATE ON public.neural_ennead_families
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_timestamp();

CREATE TRIGGER update_neural_ennead_members_updated_at
  BEFORE UPDATE ON public.neural_ennead_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_timestamp();

CREATE TRIGGER update_thinker_profiles_updated_at
  BEFORE UPDATE ON public.thinker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_timestamp();

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