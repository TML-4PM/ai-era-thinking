
-- 0) UUIDs for IDs
create extension if not exists "pgcrypto";

-- 1) Simple flat table for 729 members
create table if not exists public.neural_ennead_members_simple (
  id uuid primary key default gen_random_uuid(),
  member_code text not null unique, -- e.g., NAV-OPS-SPE
  primary_family_code text not null,
  primary_family_name text not null,
  secondary_family_code text not null,
  secondary_family_name text not null,
  tertiary_family_code text not null,
  tertiary_family_name text not null,
  display_name text not null,       -- "Navigator / Operator / Specialist"
  short_label text not null,        -- "NAV/OPS/SPE"
  description text not null,
  canonical_keywords text[] not null default '{}',
  exemplar_roles text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) RLS: public read-only
alter table public.neural_ennead_members_simple enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
      and tablename = 'neural_ennead_members_simple' 
      and policyname = 'Public read access for neural_ennead_members_simple'
  ) then
    create policy "Public read access for neural_ennead_members_simple"
      on public.neural_ennead_members_simple
      for select
      using (true);
  end if;
end $$;

-- 3) Timestamp trigger for updates
create or replace function public.update_neural_ennead_members_simple_timestamp()
returns trigger
language plpgsql
as $func$
begin
  new.updated_at = now();
  return new;
end;
$func$;

drop trigger if exists trg_update_neural_ennead_members_simple on public.neural_ennead_members_simple;

create trigger trg_update_neural_ennead_members_simple
before update on public.neural_ennead_members_simple
for each row
execute function public.update_neural_ennead_members_simple_timestamp();

-- 4) Seed 9 families inline (no separate table), cross-join to 729 combinations
with families as (
  select * from (values
    ('NAV','Navigator', array['strategy','vision','roadmap','prioritization']::text[], array['Head of Strategy','Corporate Planner']::text[]),
    ('OPS','Operator',  array['operations','process','efficiency','scaling'],        array['Operations Manager','COO Office']),
    ('SPE','Specialist',array['expertise','domain','specialist','tech-depth'],       array['Subject Matter Expert','Principal Engineer']),
    ('ARC','Architect', array['architecture','integration','systems','standards'],    array['Enterprise Architect','Solutions Architect']),
    ('ANA','Analyst',   array['analysis','metrics','insight','modelling'],           array['Data Analyst','BI Lead']),
    ('DSN','Designer',  array['design','ux','research','prototyping'],               array['UX Designer','Service Designer']),
    ('COM','Communicator', array['communication','storytelling','enablement','adoption'], array['Change Comms','Enablement Lead']),
    ('GRD','Guardian',  array['governance','risk','compliance','quality'],           array['Risk Officer','QA Lead']),
    ('CAT','Catalyst',  array['innovation','change','experimentation','incubation'], array['Innovation Lead','Transformation Manager'])
  ) as f(family_code, family_name, canonical_keywords, exemplar_roles)
)
insert into public.neural_ennead_members_simple (
  member_code,
  primary_family_code, primary_family_name,
  secondary_family_code, secondary_family_name,
  tertiary_family_code, tertiary_family_name,
  display_name, short_label, description,
  canonical_keywords, exemplar_roles
)
select
  format('%s-%s-%s', p.family_code, s.family_code, t.family_code) as member_code,
  p.family_code, p.family_name,
  s.family_code, s.family_name,
  t.family_code, t.family_name,
  format('%s / %s / %s', p.family_name, s.family_name, t.family_name) as display_name,
  format('%s/%s/%s', p.family_code, s.family_code, t.family_code) as short_label,
  format(
    'A hybrid work family combining %s (strategic direction), %s (operational support), and %s (specialized capabilities).',
    p.family_name, s.family_name, t.family_name
  ) as description,
  (
    select array_agg(distinct k)
    from unnest(p.canonical_keywords || s.canonical_keywords || t.canonical_keywords) as k
  ) as canonical_keywords,
  (
    select array_agg(distinct r)
    from unnest(p.exemplar_roles || s.exemplar_roles || t.exemplar_roles) as r
  ) as exemplar_roles
from families p
cross join families s
cross join families t
on conflict (member_code) do update set
  primary_family_code   = excluded.primary_family_code,
  primary_family_name   = excluded.primary_family_name,
  secondary_family_code = excluded.secondary_family_code,
  secondary_family_name = excluded.secondary_family_name,
  tertiary_family_code  = excluded.tertiary_family_code,
  tertiary_family_name  = excluded.tertiary_family_name,
  display_name          = excluded.display_name,
  short_label           = excluded.short_label,
  description           = excluded.description,
  canonical_keywords    = excluded.canonical_keywords,
  exemplar_roles        = excluded.exemplar_roles,
  updated_at            = now();
