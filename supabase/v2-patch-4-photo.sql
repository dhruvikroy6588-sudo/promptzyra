-- Promptzyra v2 patch 4: Photo Prompts (idempotent, safe to re-run).
-- Run in Supabase SQL editor after v2-setup.sql.

-- 1) Allow the 'photo' category kind
alter table public.pz_categories drop constraint if exists pz_categories_kind_check;
alter table public.pz_categories add constraint pz_categories_kind_check check (kind in ('prompt','tool','blog','photo'));

insert into public.pz_categories (kind, slug, name, description, intro, icon, sort_order) values
('photo','ai-photo-trends','AI Photo Trends','Ready-made prompts for popular AI photo styles you can apply to your own picture.','','camera',10),
('photo','ai-art-design','AI Art & Design','Prompts that turn your own photo into illustrated, stylised and design-led artwork.','','palette',20)
on conflict (kind, slug) do nothing;

-- 2) Photo prompts table
create table if not exists public.pz_photo_prompts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  prompt text not null default '',
  category text not null default '',          -- pz_categories.slug (kind = 'photo')
  tool text not null default 'any' check (tool in ('any','gemini','chatgpt','midjourney')),
  subject text not null default '' check (subject in ('','men','women','couple','family','kids','pets','birthday','portrait','other')),
  style text not null default '',
  tips text[] not null default '{}',
  tags text[] not null default '{}',
  image_url text not null default '',
  image_alt text not null default '',
  featured boolean not null default false,
  copy_count int not null default 0,
  status text not null default 'draft' check (status in ('draft','reviewed','scheduled','published')),
  publish_at timestamptz,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pz_photo_prompts_cat_idx on public.pz_photo_prompts (category);
create index if not exists pz_photo_prompts_status_idx on public.pz_photo_prompts (status, publish_at);

-- 3) Row level security (same pattern as pz_prompts)
alter table public.pz_photo_prompts enable row level security;
drop policy if exists "pz public read photo prompts" on public.pz_photo_prompts;
create policy "pz public read photo prompts" on public.pz_photo_prompts for select to anon, authenticated using (public.pz_visible(status, publish_at));
drop policy if exists "pz admin all photo prompts" on public.pz_photo_prompts;
create policy "pz admin all photo prompts" on public.pz_photo_prompts for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());

grant select on public.pz_photo_prompts to anon, authenticated;
grant insert, update, delete on public.pz_photo_prompts to authenticated;

-- 4) Helper functions
create or replace function public.pz_bump_photo_copy(p_slug text) returns void
language sql security definer set search_path = public as $$
  update public.pz_photo_prompts set copy_count = copy_count + 1
  where slug = p_slug and public.pz_visible(status, publish_at);
$$;
grant execute on function public.pz_bump_photo_copy(text) to anon, authenticated;

create or replace function public.pz_photo_counts() returns table(category text, n bigint)
language sql stable as $$
  select category, count(*) from public.pz_photo_prompts where public.pz_visible(status, publish_at) group by category;
$$;
grant execute on function public.pz_photo_counts() to anon, authenticated;
