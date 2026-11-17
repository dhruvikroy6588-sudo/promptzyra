-- Promptzyra v2 patch 6: Skills (downloadable SKILL.md packages). Idempotent, safe to re-run.
-- Run in Supabase SQL editor after v2-setup.sql (needs pz_visible() and pz_is_admin()).

-- 1) Allow the 'skill' category kind
alter table public.pz_categories drop constraint if exists pz_categories_kind_check;
alter table public.pz_categories add constraint pz_categories_kind_check check (kind in ('prompt','tool','blog','photo','skill'));

insert into public.pz_categories (kind, slug, name, description, intro, icon, sort_order) values
('skill','study-learning','Study & Learning','Skills that help students plan, revise and understand new topics.','','graduation-cap',10),
('skill','teaching-lesson-design','Teaching & Lesson Design','Skills for lesson plans, activities and classroom materials.','','school',20),
('skill','assessment-feedback','Assessment & Feedback','Skills for quizzes, rubrics and constructive feedback.','','list-checks',30),
('skill','writing-research','Writing & Research','Skills for outlining, drafting, editing and reading sources.','','pen-line',40),
('skill','language-learning','Language Learning','Skills for vocabulary, practice conversations and grammar help.','','message-square',50),
('skill','math-science','Math & Science','Skills for step-by-step explanations and worked examples.','','sparkles',60),
('skill','career-resume','Career & Resume','Skills for resumes, cover letters and interview practice.','','briefcase',70),
('skill','productivity-planning','Productivity & Planning','Skills for planning, summaries and decisions.','','trending-up',80),
('skill','coding-tutor','Coding Tutor','Skills that explain code and teach programming step by step.','','code',90)
on conflict (kind, slug) do nothing;

-- 2) Skills table
create table if not exists public.pz_skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  category text not null default '',          -- pz_categories.slug (kind = 'skill')
  tags text[] not null default '{}',
  audience text not null default 'Anyone',
  level text not null default 'Beginner',
  skill_md text not null default '',          -- full SKILL.md including --- frontmatter
  references_md text not null default '',     -- optional references/guide.md
  use_cases text[] not null default '{}',
  example_prompts text[] not null default '{}',
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
create index if not exists pz_skills_cat_idx on public.pz_skills (category);
create index if not exists pz_skills_status_idx on public.pz_skills (status, publish_at);

-- 3) Row level security (same pattern as pz_photo_prompts)
alter table public.pz_skills enable row level security;
drop policy if exists "pz public read skills" on public.pz_skills;
create policy "pz public read skills" on public.pz_skills for select to anon, authenticated using (public.pz_visible(status, publish_at));
drop policy if exists "pz admin all skills" on public.pz_skills;
create policy "pz admin all skills" on public.pz_skills for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());

grant select on public.pz_skills to anon, authenticated;
grant insert, update, delete on public.pz_skills to authenticated;

-- 4) Helper functions
create or replace function public.pz_bump_skill_copy(p_slug text) returns void
language sql security definer set search_path = public as $$
  update public.pz_skills set copy_count = copy_count + 1
  where slug = p_slug and public.pz_visible(status, publish_at);
$$;
grant execute on function public.pz_bump_skill_copy(text) to anon, authenticated;

create or replace function public.pz_skill_counts() returns table(category text, n bigint)
language sql stable as $$
  select category, count(*) from public.pz_skills where public.pz_visible(status, publish_at) group by category;
$$;
grant execute on function public.pz_skill_counts() to anon, authenticated;
