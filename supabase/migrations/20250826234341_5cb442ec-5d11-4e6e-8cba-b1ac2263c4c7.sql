
-- 1) Thinker member alignments (top-2 agents)
create table if not exists public.thinker_member_alignment (
  thinker_name text not null,
  domain text not null,
  member_code text not null,
  rank integer not null,
  confidence numeric,
  rationale text,
  transitions jsonb,
  model_used text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint thinker_member_alignment_pk primary key (thinker_name, domain, rank)
);

alter table public.thinker_member_alignment enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'thinker_member_alignment' and policyname = 'Public read'
  ) then
    create policy "Public read"
      on public.thinker_member_alignment
      for select
      using (true);
  end if;
end $$;

-- 2) Thinker family alignments (top-2 families)
create table if not exists public.thinker_family_alignment (
  thinker_name text not null,
  domain text not null,
  family_code text not null,
  rank integer not null,
  confidence numeric,
  rationale text,
  model_used text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint thinker_family_alignment_pk primary key (thinker_name, domain, rank)
);

alter table public.thinker_family_alignment enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'thinker_family_alignment' and policyname = 'Public read'
  ) then
    create policy "Public read"
      on public.thinker_family_alignment
      for select
      using (true);
  end if;
end $$;

-- 3) Teams (one per thinker/domain build)
create table if not exists public.thinker_alignment_teams (
  id uuid primary key default gen_random_uuid(),
  thinker_name text not null,
  domain text not null,
  team_size integer not null,
  industries text[] not null default '{}',
  overlap_cap numeric default 0.25,
  selection_strategy text,
  model_used text,
  constraints jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.thinker_alignment_teams enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'thinker_alignment_teams' and policyname = 'Public read'
  ) then
    create policy "Public read"
      on public.thinker_alignment_teams
      for select
      using (true);
  end if;
end $$;

create index if not exists idx_thinker_alignment_teams_name_domain
  on public.thinker_alignment_teams (thinker_name, domain);

-- 4) Team members (FK to team and to neural_ennead_members)
create table if not exists public.thinker_alignment_team_members (
  team_id uuid not null references public.thinker_alignment_teams(id) on delete cascade,
  member_code text not null,
  order_index integer not null,
  role_on_team text not null,
  rationale text,
  contribution_focus text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint thinker_alignment_team_members_pk primary key (team_id, order_index)
);

-- Add FK to neural_ennead_members for nested selects if it doesn't exist already
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'fk_team_member_to_neural_member'
      and table_name = 'thinker_alignment_team_members'
  ) then
    alter table public.thinker_alignment_team_members
      add constraint fk_team_member_to_neural_member
      foreign key (member_code)
      references public.neural_ennead_members(member_code)
      on update cascade on delete restrict;
  end if;
end $$;

alter table public.thinker_alignment_team_members enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'thinker_alignment_team_members' and policyname = 'Public read'
  ) then
    create policy "Public read"
      on public.thinker_alignment_team_members
      for select
      using (true);
  end if;
end $$;

create index if not exists idx_team_members_by_team
  on public.thinker_alignment_team_members (team_id);

create index if not exists idx_team_members_by_member
  on public.thinker_alignment_team_members (member_code);

-- 5) Thinker pet topics (used by Duo Chat UI)
create table if not exists public.thinker_pet_topics (
  thinker_name text primary key,
  pet_topic text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.thinker_pet_topics enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'thinker_pet_topics' and policyname = 'Public read'
  ) then
    create policy "Public read"
      on public.thinker_pet_topics
      for select
      using (true);
  end if;
end $$;

-- 6) Optional: Deep profile storage (for consistent Overview/Applications)
create table if not exists public.thinker_profiles (
  id uuid primary key default gen_random_uuid(),
  thinker_name text not null unique,
  area text,
  core_idea text,
  ai_shift text,
  lobe text,
  cross_era_relevance jsonb not null default '{}'::jsonb,
  usage_prompts jsonb not null default '[]'::jsonb,
  practical_applications jsonb not null default '{}'::jsonb,
  related_thinkers text[] not null default '{}',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.thinker_profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'thinker_profiles' and policyname = 'Public read'
  ) then
    create policy "Public read"
      on public.thinker_profiles
      for select
      using (true);
  end if;
end $$;

-- 7) Shared updated_at trigger for the new tables (uses existing function public.update_updated_at_timestamp)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_thinker_member_alignment_updated_at'
  ) then
    create trigger trg_thinker_member_alignment_updated_at
    before update on public.thinker_member_alignment
    for each row execute procedure public.update_updated_at_timestamp();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_thinker_family_alignment_updated_at'
  ) then
    create trigger trg_thinker_family_alignment_updated_at
    before update on public.thinker_family_alignment
    for each row execute procedure public.update_updated_at_timestamp();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_thinker_alignment_teams_updated_at'
  ) then
    create trigger trg_thinker_alignment_teams_updated_at
    before update on public.thinker_alignment_teams
    for each row execute procedure public.update_updated_at_timestamp();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_thinker_alignment_team_members_updated_at'
  ) then
    create trigger trg_thinker_alignment_team_members_updated_at
    before update on public.thinker_alignment_team_members
    for each row execute procedure public.update_updated_at_timestamp();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_thinker_pet_topics_updated_at'
  ) then
    create trigger trg_thinker_pet_topics_updated_at
    before update on public.thinker_pet_topics
    for each row execute procedure public.update_updated_at_timestamp();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_thinker_profiles_updated_at'
  ) then
    create trigger trg_thinker_profiles_updated_at
    before update on public.thinker_profiles
    for each row execute procedure public.update_updated_at_timestamp();
  end if;
end $$;
