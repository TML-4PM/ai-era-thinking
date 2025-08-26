
-- 1) 729-member lattice: combinations of 9 families (primary/secondary/tertiary)

CREATE TABLE IF NOT EXISTS public.neural_ennead_members (
  member_code TEXT PRIMARY KEY, -- e.g., ORACLE-GUARDIAN-ARCHITECT
  primary_family_code TEXT NOT NULL REFERENCES public.neural_ennead_families(family_code) ON DELETE CASCADE,
  secondary_family_code TEXT NOT NULL REFERENCES public.neural_ennead_families(family_code) ON DELETE CASCADE,
  tertiary_family_code TEXT NOT NULL REFERENCES public.neural_ennead_families(family_code) ON DELETE CASCADE,
  display_name TEXT NOT NULL, -- e.g., "Oracle / Guardian / Architect"
  short_label TEXT,
  description TEXT,
  canonical_keywords TEXT[] NOT NULL DEFAULT '{}',
  exemplar_roles TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (primary_family_code, secondary_family_code, tertiary_family_code)
);

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION public.set_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_neural_ennead_members_updated_at ON public.neural_ennead_members;
CREATE TRIGGER trg_neural_ennead_members_updated_at
BEFORE UPDATE ON public.neural_ennead_members
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp_updated_at();

ALTER TABLE public.neural_ennead_members ENABLE ROW LEVEL SECURITY;

-- Public read policy
DROP POLICY IF EXISTS "Public read access for neural_ennead_members" ON public.neural_ennead_members;
CREATE POLICY "Public read access for neural_ennead_members"
  ON public.neural_ennead_members
  FOR SELECT
  USING (true);

-- 2) Alignment table at member level with transitions/timeframes

CREATE TABLE IF NOT EXISTS public.thinker_member_alignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  member_code TEXT NOT NULL REFERENCES public.neural_ennead_members(member_code) ON DELETE CASCADE,
  rank INT NOT NULL DEFAULT 1,
  confidence DOUBLE PRECISION,
  rationale TEXT,
  transitions JSONB, -- e.g. {"now_0_6":"...", "mid_6_18":"...", "long_18_36":"..."}
  model_used TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (thinker_name, domain, rank)
);

DROP TRIGGER IF EXISTS trg_thinker_member_alignment_updated_at ON public.thinker_member_alignment;
CREATE TRIGGER trg_thinker_member_alignment_updated_at
BEFORE UPDATE ON public.thinker_member_alignment
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp_updated_at();

CREATE INDEX IF NOT EXISTS idx_tma_thinker_domain ON public.thinker_member_alignment (thinker_name, domain);
CREATE INDEX IF NOT EXISTS idx_tma_member_code ON public.thinker_member_alignment (member_code);

ALTER TABLE public.thinker_member_alignment ENABLE ROW LEVEL SECURITY;

-- Public read policy
DROP POLICY IF EXISTS "Public read access for thinker_member_alignment" ON public.thinker_member_alignment;
CREATE POLICY "Public read access for thinker_member_alignment"
  ON public.thinker_member_alignment
  FOR SELECT
  USING (true);

-- 3) Unique pet topic per thinker

CREATE TABLE IF NOT EXISTS public.thinker_pet_topics (
  thinker_name TEXT PRIMARY KEY,
  pet_topic TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_thinker_pet_topics_updated_at ON public.thinker_pet_topics;
CREATE TRIGGER trg_thinker_pet_topics_updated_at
BEFORE UPDATE ON public.thinker_pet_topics
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp_updated_at();

ALTER TABLE public.thinker_pet_topics ENABLE ROW LEVEL SECURITY;

-- Public read policy (no write policy so anon can’t modify; service role bypasses RLS)
DROP POLICY IF EXISTS "Public read access for thinker_pet_topics" ON public.thinker_pet_topics;
CREATE POLICY "Public read access for thinker_pet_topics"
  ON public.thinker_pet_topics
  FOR SELECT
  USING (true);
