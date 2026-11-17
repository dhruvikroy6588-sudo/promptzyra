-- Promptzyra v2 patch 7: richer AI tools directory + tool submissions (idempotent, safe to re-run).
-- Run in the Supabase SQL editor after v2-setup.sql (and patch 5, which adds og_image).

-- 1) Richer tool pages
alter table public.pz_tools add column if not exists features text[] not null default '{}';
alter table public.pz_tools add column if not exists use_cases text[] not null default '{}';
alter table public.pz_tools add column if not exists pricing_details text not null default '';
alter table public.pz_tools add column if not exists faq jsonb not null default '[]'::jsonb;
alter table public.pz_tools add column if not exists screenshot_url text not null default '';
alter table public.pz_tools add column if not exists how_to_use_intro text not null default '';

-- 2) Indexes for large directories
create index if not exists pz_tools_status_pub_idx on public.pz_tools (status, publish_at);
create index if not exists pz_tools_category_idx on public.pz_tools (category);
create index if not exists pz_tools_pricing_idx on public.pz_tools (pricing);

-- Name search index: only when the trigram extension can be enabled (skipped quietly otherwise).
do $$
begin
  begin
    create extension if not exists pg_trgm;
  exception when others then
    raise notice 'pg_trgm could not be enabled; skipping trigram index (%).', sqlerrm;
  end;
  if exists (select 1 from pg_extension where extname = 'pg_trgm') then
    execute 'create index if not exists pz_tools_name_trgm_idx on public.pz_tools using gin (lower(name) gin_trgm_ops)';
  end if;
end $$;

-- 3) Public tool submissions: anyone may submit (insert only), only the admin can read/update/delete.
create table if not exists public.pz_tool_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  website_url text not null check (char_length(website_url) between 8 and 300),
  category text not null default '',
  description text not null default '' check (char_length(description) <= 1500),
  contact_email text not null default '' check (char_length(contact_email) <= 200),
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create index if not exists pz_tool_submissions_created_idx on public.pz_tool_submissions (created_at desc);
alter table public.pz_tool_submissions enable row level security;

grant insert on public.pz_tool_submissions to anon, authenticated;
grant select, update, delete on public.pz_tool_submissions to authenticated;

drop policy if exists "pz anyone submit tool" on public.pz_tool_submissions;
create policy "pz anyone submit tool" on public.pz_tool_submissions for insert to anon, authenticated with check (status = 'new');
drop policy if exists "pz admin read tool submissions" on public.pz_tool_submissions;
create policy "pz admin read tool submissions" on public.pz_tool_submissions for select to authenticated using (public.pz_is_admin());
drop policy if exists "pz admin update tool submissions" on public.pz_tool_submissions;
create policy "pz admin update tool submissions" on public.pz_tool_submissions for update to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());
drop policy if exists "pz admin delete tool submissions" on public.pz_tool_submissions;
create policy "pz admin delete tool submissions" on public.pz_tool_submissions for delete to authenticated using (public.pz_is_admin());
