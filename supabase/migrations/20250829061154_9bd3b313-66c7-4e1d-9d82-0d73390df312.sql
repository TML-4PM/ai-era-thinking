
-- 1) User-created thinkers table
CREATE TABLE IF NOT EXISTS public.user_thinkers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- link to public.profiles instead of auth.users to avoid direct dependency on auth schema
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  lobe TEXT NOT NULL,
  core_idea TEXT NOT NULL,
  ai_shift TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public' | 'private' | 'unlisted'
  -- Canonical deep structure (Daniel-template) as JSON
  deep_profile JSONB, -- keys: summary, keyConcepts[], whyItMatters, aiImplications[], recommendedPractices[], commonPitfalls[], successMetrics[]
  usage_prompts TEXT[],            -- list of prompts
  practical_applications TEXT[],   -- list of applications
  related_thinkers TEXT[],         -- names (strings)
  cross_era_relevance JSONB,       -- { ai_relevance, cross_era_relevance, implementation_timeline: { phase_1, phase_2, phase_3 } }
  metadata JSONB,
  approved BOOLEAN NOT NULL DEFAULT FALSE, -- can be used later for moderation if needed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_thinkers_creator ON public.user_thinkers(creator_id);
CREATE INDEX IF NOT EXISTS idx_user_thinkers_visibility ON public.user_thinkers(visibility);
CREATE INDEX IF NOT EXISTS idx_user_thinkers_name_trgm ON public.user_thinkers USING GIN (name gin_trgm_ops);

-- Auto-update updated_at on write
DROP TRIGGER IF EXISTS trg_user_thinkers_updated_at ON public.user_thinkers;
CREATE TRIGGER trg_user_thinkers_updated_at
BEFORE UPDATE ON public.user_thinkers
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();

-- Enable RLS
ALTER TABLE public.user_thinkers ENABLE ROW LEVEL SECURITY;

-- RLS: Public can read public entries; creators can read their own private/unlisted
DROP POLICY IF EXISTS "user_thinkers_select" ON public.user_thinkers;
CREATE POLICY "user_thinkers_select"
ON public.user_thinkers
FOR SELECT
USING (
  visibility = 'public'
  OR creator_id = auth.uid()
);

-- RLS: Paid users and admins can insert (must insert as themselves)
DROP POLICY IF EXISTS "user_thinkers_insert_paid_only" ON public.user_thinkers;
CREATE POLICY "user_thinkers_insert_paid_only"
ON public.user_thinkers
FOR INSERT
WITH CHECK (
  creator_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('paid','admin')
  )
);

-- RLS: Only creator or admin can update
DROP POLICY IF EXISTS "user_thinkers_update_owner_or_admin" ON public.user_thinkers;
CREATE POLICY "user_thinkers_update_owner_or_admin"
ON public.user_thinkers
FOR UPDATE
USING (
  creator_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  )
)
WITH CHECK (
  creator_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  )
);

-- RLS: Only creator or admin can delete
DROP POLICY IF EXISTS "user_thinkers_delete_owner_or_admin" ON public.user_thinkers;
CREATE POLICY "user_thinkers_delete_owner_or_admin"
ON public.user_thinkers
FOR DELETE
USING (
  creator_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  )
);

-- 2) Favorites table (supports built-in by name OR user-created by id)
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thinker_name TEXT,        -- for built-in thinkers defined in src/data/thinkers.ts
  user_thinker_id UUID REFERENCES public.user_thinkers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Exactly one of thinker_name or user_thinker_id must be set
  CONSTRAINT chk_fav_one_target CHECK (
    (thinker_name IS NOT NULL AND user_thinker_id IS NULL)
    OR (thinker_name IS NULL AND user_thinker_id IS NOT NULL)
  )
);

-- Avoid duplicates via partial unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_fav_builtin
  ON public.user_favorites (user_id, thinker_name)
  WHERE thinker_name IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_fav_user_thinker
  ON public.user_favorites (user_id, user_thinker_id)
  WHERE user_thinker_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS: Only owner can read their favorites
DROP POLICY IF EXISTS "user_favorites_select_own" ON public.user_favorites;
CREATE POLICY "user_favorites_select_own"
ON public.user_favorites
FOR SELECT
USING (user_id = auth.uid());

-- RLS: Only owner can insert
DROP POLICY IF EXISTS "user_favorites_insert_own" ON public.user_favorites;
CREATE POLICY "user_favorites_insert_own"
ON public.user_favorites
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- RLS: Only owner can update
DROP POLICY IF EXISTS "user_favorites_update_own" ON public.user_favorites;
CREATE POLICY "user_favorites_update_own"
ON public.user_favorites
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS: Only owner can delete
DROP POLICY IF EXISTS "user_favorites_delete_own" ON public.user_favorites;
CREATE POLICY "user_favorites_delete_own"
ON public.user_favorites
FOR DELETE
USING (user_id = auth.uid());
