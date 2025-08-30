
-- 1) Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- 2) Families table (9 canonical families)
create table if not exists public.neural_ennead_families (
  family_code text primary key,
  family_name text not null,
  description text not null,
  canonical_keywords text[] not null default '{}',
  exemplar_roles text[] not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- RLS with public read-only
alter table public.neural_ennead_families enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'neural_ennead_families' and policyname = 'Public read access for neural_ennead_families'
  ) then
    create policy "Public read access for neural_ennead_families"
      on public.neural_ennead_families
      for select
      using (true);
  end if;
end $$;

-- Seed the 9 families (idempotent upsert on primary key)
insert into public.neural_ennead_families (family_code, family_name, description, canonical_keywords, exemplar_roles)
values
  ('NAV','Navigator','Sets direction, strategy, and long-range positioning.',
    array['strategy','vision','roadmap','prioritization'],
    array['Head of Strategy','Corporate Planner']),
  ('OPS','Operator','Runs day-to-day operations and drives execution at scale.',
    array['operations','process','efficiency','scaling'],
    array['Operations Manager','COO Office']),
  ('SPE','Specialist','Provides deep domain or technical expertise.',
    array['expertise','domain','specialist','tech-depth'],
    array['Subject Matter Expert','Principal Engineer']),
  ('ARC','Architect','Designs systems, integration patterns, and enterprise structures.',
    array['architecture','integration','systems','standards'],
    array['Enterprise Architect','Solutions Architect']),
  ('ANA','Analyst','Turns data into decisions; measures, models, and monitors.',
    array['analysis','metrics','insight','modelling'],
    array['Data Analyst','BI Lead']),
  ('DSN','Designer','Crafts experiences and interfaces; human-centered delivery.',
    array['design','ux','research','prototyping'],
    array['UX Designer','Service Designer']),
  ('COM','Communicator','Aligns stakeholders, narrative, and adoption.',
    array['communication','storytelling','enablement','adoption'],
    array['Change Comms','Enablement Lead']),
  ('GRD','Guardian','Governs risk, compliance, and quality.',
    array['governance','risk','compliance','quality'],
    array['Risk Officer','QA Lead']),
  ('CAT','Catalyst','Drives change, experimentation, and innovation.',
    array['innovation','change','experimentation','incubation'],
    array['Innovation Lead','Transformation Manager'])
on conflict (family_code) do update set
  family_name = excluded.family_name,
  description = excluded.description,
  canonical_keywords = excluded.canonical_keywords,
  exemplar_roles = excluded.exemplar_roles,
  updated_at = now();

-- 3) Members table (729 combinations)
create table if not exists public.neural_ennead_members (
  id uuid primary key default gen_random_uuid(),
  member_code text not null unique,
  primary_family_code text not null references public.neural_ennead_families(family_code) on update cascade on delete restrict,
  secondary_family_code text not null references public.neural_ennead_families(family_code) on update cascade on delete restrict,
  tertiary_family_code text not null references public.neural_ennead_families(family_code) on update cascade on delete restrict,
  display_name text not null,
  short_label text not null,
  description text not null,
  canonical_keywords text[] not null default '{}',
  exemplar_roles text[] not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- RLS with public read-only
alter table public.neural_ennead_members enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'neural_ennead_members' and policyname = 'Public read access for neural_ennead_members'
  ) then
    create policy "Public read access for neural_ennead_members"
      on public.neural_ennead_members
      for select
      using (true);
  end if;
end $$;

-- 4) Generate all 9×9×9 = 729 members (idempotent)
insert into public.neural_ennead_members (
  member_code,
  primary_family_code,
  secondary_family_code,
  tertiary_family_code,
  display_name,
  short_label,
  description,
  canonical_keywords,
  exemplar_roles
)
select
  format('%s-%s-%s', p.family_code, s.family_code, t.family_code) as member_code,
  p.family_code as primary_family_code,
  s.family_code as secondary_family_code,
  t.family_code as tertiary_family_code,
  format('%s / %s / %s', p.family_name, s.family_name, t.family_name) as display_name,
  format('%s/%s/%s', left(p.family_code,3), left(s.family_code,3), left(t.family_code,3)) as short_label,
  format(
    'A hybrid work family combining %s (strategic direction), %s (operational support), and %s (specialized capabilities). This member blends %s strengths with %s support and %s expertise.',
    p.family_name, s.family_name, t.family_name, p.family_name, s.family_name, t.family_name
  ) as description,
  (
    select array_agg(distinct k)
    from unnest(coalesce(p.canonical_keywords,'{}') || coalesce(s.canonical_keywords,'{}') || coalesce(t.canonical_keywords,'{}')) as k
  ) as canonical_keywords,
  (
    select array_agg(distinct r)
    from unnest(coalesce(p.exemplar_roles,'{}') || coalesce(s.exemplar_roles,'{}') || coalesce(t.exemplar_roles,'{}')) as r
  ) as exemplar_roles
from public.neural_ennead_families p
cross join public.neural_ennead_families s
cross join public.neural_ennead_families t
on conflict (member_code) do update set
  display_name = excluded.display_name,
  short_label = excluded.short_label,
  description = excluded.description,
  canonical_keywords = excluded.canonical_keywords,
  exemplar_roles = excluded.exemplar_roles,
  updated_at = now();

-- 5) Convenience view for easy export/read
create or replace view public.neural_ennead_members_overview as
select
  m.member_code,
  m.display_name,
  m.short_label,
  p.family_name as primary_family,
  s.family_name as secondary_family,
  t.family_name as tertiary_family,
  m.description,
  m.canonical_keywords,
  m.exemplar_roles,
  m.created_at
from public.neural_ennead_members m
join public.neural_ennead_families p on p.family_code = m.primary_family_code
join public.neural_ennead_families s on s.family_code = m.secondary_family_code
join public.neural_ennead_families t on t.family_code = m.tertiary_family_code;
