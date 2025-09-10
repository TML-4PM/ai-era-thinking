-- Create book leader mappings table
CREATE TABLE public.book_leader_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  thinker_name TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book contributions table
CREATE TABLE public.book_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  user_thinker_id UUID REFERENCES public.user_thinkers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'rejected')),
  created_by UUID DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book blockers table
CREATE TABLE public.book_blockers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolved BOOLEAN DEFAULT false,
  created_by UUID DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book appendices table
CREATE TABLE public.book_appendices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  content JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, key)
);

-- Enable RLS on all tables
ALTER TABLE public.book_leader_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_appendices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for book_leader_mappings
CREATE POLICY "Everyone can view book leader mappings" 
ON public.book_leader_mappings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert book leader mappings" 
ON public.book_leader_mappings FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update book leader mappings" 
ON public.book_leader_mappings FOR UPDATE 
TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete book leader mappings" 
ON public.book_leader_mappings FOR DELETE 
TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for book_contributions
CREATE POLICY "Everyone can view book contributions" 
ON public.book_contributions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert book contributions" 
ON public.book_contributions FOR INSERT 
TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins or creators can update book contributions" 
ON public.book_contributions FOR UPDATE 
TO authenticated USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = created_by);

-- RLS Policies for book_blockers
CREATE POLICY "Everyone can view book blockers" 
ON public.book_blockers FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert book blockers" 
ON public.book_blockers FOR INSERT 
TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins or creators can update book blockers" 
ON public.book_blockers FOR UPDATE 
TO authenticated USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = created_by);

-- RLS Policies for book_appendices
CREATE POLICY "Everyone can view book appendices" 
ON public.book_appendices FOR SELECT USING (true);

CREATE POLICY "Admins can manage book appendices" 
ON public.book_appendices FOR ALL 
TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed some sample book leader mappings
INSERT INTO public.book_leader_mappings (book_id, thinker_name, priority) 
SELECT b.id, 'Daniel Kahneman', 1 
FROM public.books b WHERE b.slug = 'thinking-fast-slow' LIMIT 1;

INSERT INTO public.book_leader_mappings (book_id, thinker_name, priority) 
SELECT b.id, 'Nassim Nicholas Taleb', 2 
FROM public.books b WHERE b.slug = 'thinking-fast-slow' LIMIT 1;

INSERT INTO public.book_leader_mappings (book_id, thinker_name, priority) 
SELECT b.id, 'Clayton Christensen', 1 
FROM public.books b WHERE b.slug = 'innovators-dilemma' LIMIT 1;

-- Create refresh appendices function
CREATE OR REPLACE FUNCTION public.refresh_book_appendices()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update latest metrics for all books
  INSERT INTO public.book_appendices (book_id, key, content, updated_at)
  SELECT 
    b.id,
    'latest_metrics',
    jsonb_build_object(
      'last_refreshed', now(),
      'total_contributions', COALESCE(bc.contribution_count, 0),
      'active_blockers', COALESCE(bb.blocker_count, 0)
    ),
    now()
  FROM public.books b
  LEFT JOIN (
    SELECT book_id, COUNT(*) as contribution_count 
    FROM public.book_contributions 
    WHERE status = 'approved' 
    GROUP BY book_id
  ) bc ON b.id = bc.book_id
  LEFT JOIN (
    SELECT book_id, COUNT(*) as blocker_count 
    FROM public.book_blockers 
    WHERE resolved = false 
    GROUP BY book_id
  ) bb ON b.id = bb.book_id
  ON CONFLICT (book_id, key) 
  DO UPDATE SET 
    content = EXCLUDED.content,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Schedule daily refresh at 2 AM
SELECT cron.schedule(
  'refresh-book-appendices-daily',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://lzfgigiyqpuuxslsygjt.supabase.co/functions/v1/refresh-appendices',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6ZmdpZ2l5cXB1dXhzbHN5Z2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTc0NjksImV4cCI6MjA1OTk5MzQ2OX0.qUNzDEr2rxjRSClh5P4jeDv_18_yCCkFXTizJqNYSgg"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);