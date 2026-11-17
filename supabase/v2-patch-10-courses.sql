-- Promptzyra v2 patch 10: AI Courses (free and paid course links). Idempotent.
create table if not exists public.pz_courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  provider text not null default '',
  description text not null default '',
  category text not null default '',
  level text not null default 'Beginner',
  cost text not null default 'Free',            -- Free | Free + paid certificate | Freemium | Paid
  format text not null default 'Website',       -- YouTube | Website | Platform
  language text not null default 'English',
  duration text not null default '',
  url text not null default '',
  what_you_learn text[] not null default '{}',
  who_for text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  click_count int not null default 0,
  status text not null default 'draft' check (status in ('draft','reviewed','scheduled','published')),
  publish_at timestamptz,
  seo_title text not null default '',
  seo_description text not null default '',
  og_image text not null default '',
  last_checked text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pz_courses_idx on public.pz_courses (status, publish_at, category);
alter table public.pz_courses enable row level security;
drop policy if exists "pz public read courses" on public.pz_courses;
create policy "pz public read courses" on public.pz_courses for select to anon, authenticated using (public.pz_visible(status, publish_at));
drop policy if exists "pz admin all courses" on public.pz_courses;
create policy "pz admin all courses" on public.pz_courses for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());
grant select on public.pz_courses to anon, authenticated;
grant insert, update, delete on public.pz_courses to authenticated;

create or replace function public.pz_bump_course_click(p_slug text) returns void
language sql security definer set search_path = public as $$
  update public.pz_courses set click_count = click_count + 1 where slug = p_slug and public.pz_visible(status, publish_at);
$$;
grant execute on function public.pz_bump_course_click(text) to anon, authenticated;

create or replace function public.pz_course_counts() returns table(category text, n bigint)
language sql stable as $$
  select category, count(*) from public.pz_courses where public.pz_visible(status, publish_at) group by category;
$$;
grant execute on function public.pz_course_counts() to anon, authenticated;

-- Allow 'Unknown' pricing for tools whose plans have not been verified yet
alter table public.pz_tools drop constraint if exists pz_tools_pricing_check;
alter table public.pz_tools add constraint pz_tools_pricing_check check (pricing in ('Free','Freemium','Free trial','Paid','Open source','Unknown'));
