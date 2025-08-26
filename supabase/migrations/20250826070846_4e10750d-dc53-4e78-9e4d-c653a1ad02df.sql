
-- 1) Canonical WorkFamilyAI / Neural Ennead taxonomy
create table if not exists public.neural_ennead_families (
  id uuid primary key default gen_random_uuid(),
  family_code text unique not null,
  family_name text unique not null,
  description text,
  exemplar_roles text[],
  canonical_keywords text[],
  source_urls text[],
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to keep updated_at fresh
create or replace function public.update_neural_ennead_families_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_update_neural_ennead_families on public.neural_ennead_families;
create trigger trg_update_neural_ennead_families
before update on public.neural_ennead_families
for each row execute function public.update_neural_ennead_families_timestamp();

alter table public.neural_ennead_families enable row level security;

-- Public read, admin-only write
create policy "Public can read Neural Ennead families"
on public.neural_ennead_families
for select
to public
using (true);

create policy "Admins can insert Neural Ennead families"
on public.neural_ennead_families
for insert
to authenticated
with check (public.has_role('admin'));

create policy "Admins can update Neural Ennead families"
on public.neural_ennead_families
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Admins can delete Neural Ennead families"
on public.neural_ennead_families
for delete
to authenticated
using (public.has_role('admin'));

create index if not exists idx_ne_families_family_code on public.neural_ennead_families(family_code);
create index if not exists idx_ne_families_family_name on public.neural_ennead_families(family_name);


-- 2) Persisted alignments per thinker/domain
create table if not exists public.thinker_family_alignment (
  id uuid primary key default gen_random_uuid(),
  thinker_name text not null,
  domain text not null,
  family_code text not null references public.neural_ennead_families(family_code) on update cascade on delete restrict,
  rank smallint not null default 1 check (rank in (1,2)),
  confidence numeric(4,3) not null default 0.000 check (confidence >= 0 and confidence <= 1),
  rationale text,
  model_used text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (thinker_name, domain, rank)
);

-- Trigger to keep updated_at fresh
create or replace function public.update_thinker_family_alignment_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_update_thinker_family_alignment on public.thinker_family_alignment;
create trigger trg_update_thinker_family_alignment
before update on public.thinker_family_alignment
for each row execute function public.update_thinker_family_alignment_timestamp();

alter table public.thinker_family_alignment enable row level security;

-- Public read, admin-only write
create policy "Public can read thinker-family alignment"
on public.thinker_family_alignment
for select
to public
using (true);

create policy "Admins can insert thinker-family alignment"
on public.thinker_family_alignment
for insert
to authenticated
with check (public.has_role('admin'));

create policy "Admins can update thinker-family alignment"
on public.thinker_family_alignment
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Admins can delete thinker-family alignment"
on public.thinker_family_alignment
for delete
to authenticated
using (public.has_role('admin'));

create index if not exists idx_tfa_thinker on public.thinker_family_alignment(thinker_name);
create index if not exists idx_tfa_family on public.thinker_family_alignment(family_code);
create index if not exists idx_tfa_domain on public.thinker_family_alignment(domain);
