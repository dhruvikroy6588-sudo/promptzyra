-- Promptzyra v2 patch 9: Agents, Commands, Settings, Hooks, MCPs, Mods, Plugins (one shared table). Idempotent.
-- Run in Supabase SQL editor after v2-setup.sql (needs pz_visible() and pz_is_admin()).
create table if not exists public.pz_components (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('agents','commands','settings','hooks','mcps','mods','plugins')),
  slug text unique not null,
  name text not null,
  description text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  author text not null default 'Promptzyra',
  github_url text not null default '',
  stars int not null default 0,             -- optional, enter only a number you have checked yourself
  install text not null default '',
  files jsonb not null default '[]'::jsonb, -- [{"path":"x.md","content":"..."}]
  use_cases text[] not null default '{}',
  example_prompts text[] not null default '{}',
  audience text not null default 'Anyone',
  level text not null default 'Beginner',
  featured boolean not null default false,
  copy_count int not null default 0,
  status text not null default 'draft' check (status in ('draft','reviewed','scheduled','published')),
  publish_at timestamptz,
  seo_title text not null default '',
  seo_description text not null default '',
  og_image text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pz_components_type_idx on public.pz_components (type, status, publish_at);
alter table public.pz_components enable row level security;
drop policy if exists "pz public read components" on public.pz_components;
create policy "pz public read components" on public.pz_components for select to anon, authenticated using (public.pz_visible(status, publish_at));
drop policy if exists "pz admin all components" on public.pz_components;
create policy "pz admin all components" on public.pz_components for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());
grant select on public.pz_components to anon, authenticated;
grant insert, update, delete on public.pz_components to authenticated;

create or replace function public.pz_bump_component_copy(p_slug text) returns void
language sql security definer set search_path = public as $$
  update public.pz_components set copy_count = copy_count + 1 where slug = p_slug and public.pz_visible(status, publish_at);
$$;
grant execute on function public.pz_bump_component_copy(text) to anon, authenticated;

create or replace function public.pz_component_counts() returns table(category text, n bigint)
language sql stable as $$
  select type, count(*) from public.pz_components where public.pz_visible(status, publish_at) group by type;
$$;
grant execute on function public.pz_component_counts() to anon, authenticated;
