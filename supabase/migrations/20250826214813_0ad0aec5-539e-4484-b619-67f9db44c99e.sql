
-- 1) Teams table to store an assembled team per author/domain run
CREATE TABLE IF NOT EXISTS public.thinker_alignment_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thinker_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  team_size INT NOT NULL DEFAULT 9,
  industries TEXT[] NOT NULL DEFAULT '{}',          -- UI-selected context
  overlap_cap NUMERIC NOT NULL DEFAULT 0.25,        -- global reuse cap guidance
  selection_strategy TEXT,                           -- notes on heuristic/prompt
  model_used TEXT,                                   -- model that generated narratives
  constraints JSONB,                                 -- optional: any constraint metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS trg_thinker_alignment_teams_updated_at ON public.thinker_alignment_teams;
CREATE TRIGGER trg_thinker_alignment_teams_updated_at
BEFORE UPDATE ON public.thinker_alignment_teams
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp_updated_at();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_teams_thinker_domain_created 
  ON public.thinker_alignment_teams (thinker_name, domain, created_at DESC);


-- 2) Team members table linking team to selected WorkFamily members with roles/rationales
CREATE TABLE IF NOT EXISTS public.thinker_alignment_team_members (
  team_id UUID NOT NULL REFERENCES public.thinker_alignment_teams(id) ON DELETE CASCADE,
  member_code TEXT NOT NULL REFERENCES public.neural_ennead_members(member_code) ON DELETE RESTRICT,
  order_index INT NOT NULL DEFAULT 1,                 -- display order / priority
  role_on_team TEXT,                                  -- "Team Lead, Systems Thinker", etc.
  rationale TEXT,                                     -- "Why they’re here" narrative
  contribution_focus TEXT,                            -- optional: timeframe or focus area
  metadata JSONB,                                     -- optional extra details
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_thinker_alignment_team_members PRIMARY KEY (team_id, member_code)
);

DROP TRIGGER IF EXISTS trg_thinker_alignment_team_members_updated_at ON public.thinker_alignment_team_members;
CREATE TRIGGER trg_thinker_alignment_team_members_updated_at
BEFORE UPDATE ON public.thinker_alignment_team_members
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp_updated_at();

-- Indexes for fast lookups and reuse checks
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.thinker_alignment_team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_member_code ON public.thinker_alignment_team_members (member_code);


-- 3) RLS: public read-only; writes only via service role in edge functions
ALTER TABLE public.thinker_alignment_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thinker_alignment_team_members ENABLE ROW LEVEL SECURITY;

-- Read policies (public SELECT)
DROP POLICY IF EXISTS "Public read access for thinker_alignment_teams" ON public.thinker_alignment_teams;
CREATE POLICY "Public read access for thinker_alignment_teams"
  ON public.thinker_alignment_teams
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read access for thinker_alignment_team_members" ON public.thinker_alignment_team_members;
CREATE POLICY "Public read access for thinker_alignment_team_members"
  ON public.thinker_alignment_team_members
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies for anon; edge functions (service role) bypass RLS.
