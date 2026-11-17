-- ============================================================================
-- Promptzyra v2 database setup  (run ONCE in the PROMPTZYRA Supabase SQL editor)
-- Safe to re-run: everything uses "if not exists" / "or replace" / "drop policy if exists".
-- Do NOT run this in the EPSNIX project.
--
-- ADMIN EMAIL: the only account allowed to write is defined in ONE place below
-- (function pz_is_admin). To change the admin later, edit that one line and re-run.
-- ============================================================================

-- 0) Single admin check used by every policy ---------------------------------
create or replace function public.pz_is_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('dhruvikroy6588@gmail.com');
$$;

-- A row is public when it is published, or scheduled and its date has arrived.
create or replace function public.pz_visible(p_status text, p_publish_at timestamptz) returns boolean
language sql stable as $$
  select (p_status = 'published' and (p_publish_at is null or p_publish_at <= now()))
      or (p_status = 'scheduled' and p_publish_at is not null and p_publish_at <= now());
$$;

-- 1) Categories (prompts, tools, blog) ---------------------------------------
create table if not exists public.pz_categories (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('prompt','tool','blog')),
  slug text not null,
  name text not null,
  description text not null default '',   -- short, used in cards and meta description
  intro text not null default '',          -- longer original text shown on the category page (good for SEO)
  icon text not null default 'sparkles',
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  unique (kind, slug)
);

-- 2) Prompt library -----------------------------------------------------------
create table if not exists public.pz_prompts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,                  -- pz_categories.slug (kind = 'prompt')
  subcategory text not null default '',
  summary text not null default '',        -- one-line meta description (140-160 chars)
  prompt text not null default '',         -- use {{variable-name}} placeholders
  when_to_use text not null default '',    -- 1-2 sentences
  how_to_use text not null default '',     -- one step per line
  example_output text not null default '',
  tips text[] not null default '{}',
  models text[] not null default '{chatgpt,claude,gemini}',
  audience text not null default '',       -- e.g. Student, Teacher, Job seeker
  level text not null default 'Beginner',
  language text not null default 'English',
  tags text[] not null default '{}',
  faq jsonb not null default '[]'::jsonb,   -- [{"q":"...","a":"..."}]
  related_tools text[] not null default '{}', -- tool slugs
  seo_title text not null default '',
  seo_description text not null default '',
  featured boolean not null default false,
  copy_count integer not null default 0,
  status text not null default 'draft' check (status in ('draft','reviewed','scheduled','published')),
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pz_prompts_cat_idx on public.pz_prompts (category);
create index if not exists pz_prompts_status_idx on public.pz_prompts (status, publish_at);

-- 3) AI tools directory -------------------------------------------------------
create table if not exists public.pz_tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',    -- 150-250 words of original explanation
  category text not null,                  -- pz_categories.slug (kind = 'tool')
  website_url text not null default '',
  pricing text not null default 'Freemium' check (pricing in ('Free','Freemium','Free trial','Paid','Open source')),
  best_for text not null default '',
  platforms text[] not null default '{Web}',
  use_steps text[] not null default '{}',
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  alternatives text[] not null default '{}',   -- other tool slugs
  tags text[] not null default '{}',
  logo_url text not null default '',
  last_checked date,                       -- set when YOU verified pricing/features
  seo_title text not null default '',
  seo_description text not null default '',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','reviewed','scheduled','published')),
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pz_tools_cat_idx on public.pz_tools (category);
create index if not exists pz_tools_status_idx on public.pz_tools (status, publish_at);

-- 4) Public site settings (NEVER store secrets here: anyone can read this table) --
create table if not exists public.pz_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 5) Blog (existing table) gets SEO + scheduling columns ----------------------
alter table public.promptzyra_posts add column if not exists seo_title text default '';
alter table public.promptzyra_posts add column if not exists seo_description text default '';
alter table public.promptzyra_posts add column if not exists publish_at timestamptz;
alter table public.promptzyra_posts add column if not exists faq jsonb default '[]'::jsonb;

-- 6) Row level security --------------------------------------------------------
alter table public.pz_categories enable row level security;
alter table public.pz_prompts    enable row level security;
alter table public.pz_tools      enable row level security;
alter table public.pz_settings   enable row level security;

grant select on public.pz_categories, public.pz_prompts, public.pz_tools, public.pz_settings to anon, authenticated;
grant insert, update, delete on public.pz_categories, public.pz_prompts, public.pz_tools, public.pz_settings to authenticated;

-- categories + settings: public read, admin write
drop policy if exists "pz public read categories" on public.pz_categories;
create policy "pz public read categories" on public.pz_categories for select to anon, authenticated using (true);
drop policy if exists "pz admin write categories" on public.pz_categories;
create policy "pz admin write categories" on public.pz_categories for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());

drop policy if exists "pz public read settings" on public.pz_settings;
create policy "pz public read settings" on public.pz_settings for select to anon, authenticated using (true);
drop policy if exists "pz admin write settings" on public.pz_settings;
create policy "pz admin write settings" on public.pz_settings for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());

-- prompts: public sees only visible rows, admin sees and edits everything
drop policy if exists "pz public read prompts" on public.pz_prompts;
create policy "pz public read prompts" on public.pz_prompts for select to anon, authenticated using (public.pz_visible(status, publish_at));
drop policy if exists "pz admin all prompts" on public.pz_prompts;
create policy "pz admin all prompts" on public.pz_prompts for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());

-- tools
drop policy if exists "pz public read tools" on public.pz_tools;
create policy "pz public read tools" on public.pz_tools for select to anon, authenticated using (public.pz_visible(status, publish_at));
drop policy if exists "pz admin all tools" on public.pz_tools;
create policy "pz admin all tools" on public.pz_tools for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());

-- blog / legacy cards: published AND date reached (scheduled blogs: set published=true + future publish_at)
drop policy if exists "Anyone can read published Promptzyra posts" on public.promptzyra_posts;
drop policy if exists "pz public read posts" on public.promptzyra_posts;
create policy "pz public read posts" on public.promptzyra_posts for select to anon, authenticated
  using (published = true and (publish_at is null or publish_at <= now()));


-- blog + legacy cards: the single admin can read (incl. drafts) and write everything
drop policy if exists "pz admin all posts" on public.promptzyra_posts;
create policy "pz admin all posts" on public.promptzyra_posts for all to authenticated using (public.pz_is_admin()) with check (public.pz_is_admin());
grant select on public.promptzyra_posts to anon, authenticated;
grant insert, update, delete on public.promptzyra_posts to authenticated;

-- 7) Helper functions ------------------------------------------------------------
-- copy counter (+1 per call, only for visible prompts)
create or replace function public.pz_bump_copy(p_slug text) returns void
language sql security definer set search_path = public as $$
  update public.pz_prompts set copy_count = copy_count + 1
  where slug = p_slug and public.pz_visible(status, publish_at);
$$;
grant execute on function public.pz_bump_copy(text) to anon, authenticated;

create or replace function public.pz_prompt_counts() returns table(category text, n bigint)
language sql stable as $$
  select category, count(*) from public.pz_prompts where public.pz_visible(status, publish_at) group by category;
$$;
create or replace function public.pz_tool_counts() returns table(category text, n bigint)
language sql stable as $$
  select category, count(*) from public.pz_tools where public.pz_visible(status, publish_at) group by category;
$$;
grant execute on function public.pz_prompt_counts() to anon, authenticated;
grant execute on function public.pz_tool_counts() to anon, authenticated;

-- 8) Starter categories (edit text later from Admin > Categories) ------------------
insert into public.pz_categories (kind, slug, name, description, intro, icon, sort_order) values
('prompt','education','Education & Teaching','Lesson plans, quizzes, explanations and study material for teachers and tutors.','Teaching well takes preparation time that most teachers do not have. The prompts in this category help you draft lesson plans, rubrics, quizzes, worked examples and plain-language explanations in minutes, so you can spend your time on the part only a person can do: knowing your students. Every prompt asks for the grade level, subject and outcome first, because a prompt without those details gives generic results. Treat the output as a first draft, check facts against your syllabus, and adapt it to your class.','graduation-cap',10),
('prompt','students','Students & Exams','Study plans, revision notes, flashcards and exam practice for school and college students.','Good studying is mostly about turning material into questions and spacing practice over time. These prompts help students build revision schedules, summarise chapters, create flashcards, practise past-paper style questions and explain hard ideas step by step. They are written for board exams, competitive exams and university courses. Use them to understand a topic better, not to skip the learning: always check answers against your textbook or teacher.','book-open',20),
('prompt','careers','Careers & Resume','Resume bullets, cover letters, interview practice and job search prompts.','A clear resume and a well-prepared interview are easier when you have a structured starting point. These prompts help you turn duties into achievements, tailor a resume to a job post, draft a cover letter in your own voice, and practise common interview questions. Never let an AI invent experience: add your real facts, numbers and examples, and read everything aloud before you send it.','briefcase',30),
('prompt','writing','Writing & Editing','Outlines, drafts, rewrites, proofreading and tone adjustment.','Writing prompts work best when you tell the model who the reader is, what you want them to do, and what voice to use. This category covers outlines, first drafts, rewriting for clarity, shortening, proofreading and adjusting tone. Keep your own ideas at the centre and use the AI to remove friction, not to replace your thinking.','pen-line',40),
('prompt','productivity','Productivity & Planning','Planning, meetings, decision making, summaries and daily routines.','Productivity prompts turn vague goals into plans you can act on. Use them to break a project into tasks, prepare an agenda, summarise a long document, compare options before a decision or review your week. They work best when you paste in real context such as your deadline, your constraints and what done looks like.','list-checks',50),
('prompt','coding','Coding & Tech','Explain code, debug, write tests, learn a language and review pull requests.','Coding prompts get better results when you share the language, the error message, what you already tried and what correct behaviour looks like. This category helps you understand unfamiliar code, debug step by step, write unit tests, plan small projects and learn new concepts. Always run and review generated code yourself before using it in real projects.','code',60),
('prompt','business','Business & Marketing','Plans, customer emails, product copy, research and strategy prompts.','Small businesses and freelancers use these prompts to draft customer emails, outline marketing plans, write product descriptions, prepare proposals and structure market research. Add your real numbers, audience and brand voice, and check any claim or statistic before you publish it.','building-2',70),
('prompt','social-media','Social Media & Content','Captions, content calendars, video scripts and repurposing ideas.','Creators need a steady stream of ideas without sounding repetitive. These prompts help you plan a content calendar, draft captions and hooks, outline short video scripts and repurpose one idea into several formats. Keep your personal voice and examples in the final version so your content stays recognisable.','megaphone',80),
('prompt','ai-images','AI Image & Photo','Prompts and prompt formulas for AI image generation and photo editing.','Image prompts need a clear subject, setting, lighting, composition and style, plus a few constraints about what to avoid. The prompts here give you structured starting points you can adapt for portraits, product shots, posters and illustrations. Results vary by model, so generate a few variations, review them carefully and respect usage rights.','image',90),
('prompt','daily-life','Daily Life & Learning','Everyday help: travel planning, budgeting, learning new skills and decisions.','Everyday prompts help with the small planning tasks that take time: a weekend itinerary, a monthly budget outline, a learning plan for a new hobby, or a clear comparison before you buy something. Share your real constraints such as budget, time and preferences, and verify prices, timings and safety information from official sources.','sun',100),

('tool','chat-assistants','Chat Assistants','General AI chat assistants for questions, writing, analysis and brainstorming.','Chat assistants are the best starting point for most people. You type a request in plain language and get an answer, a draft or an explanation back. They differ in writing style, how much context they can read, which files they accept and what is free. This category explains what each assistant is good at so you can pick one and learn it well.','message-square',10),
('tool','writing','Writing & Editing','AI tools for drafting, rewriting, grammar and tone.','Writing tools help you draft faster and polish what you have written: grammar and clarity checks, paraphrasing, tone changes and long-form drafting. Each listing explains who it suits and where the free plan stops.','pen-line',20),
('tool','image','Image Generation & Editing','Tools that create or edit images, remove backgrounds and upscale photos.','Image tools range from text-to-image generators to background removers, upscalers and photo editors. Check each tool for commercial-use rules, watermarks on free plans and how it handles uploaded photos of people.','image',30),
('tool','video','Video & Animation','AI tools for video generation, editing, captions and animation.','Video tools help you create clips from text or images, cut long recordings into shorts, add captions and clean up audio. Free tiers usually limit length, resolution or exports, so each listing notes what to expect.','video',40),
('tool','audio','Audio & Voice','Speech-to-text, text-to-speech, music and audio clean-up tools.','Audio tools transcribe meetings and lectures, turn text into natural speech, clean noisy recordings and help create music. Review the voice and consent rules before cloning or publishing any voice.','mic',50),
('tool','coding','Coding & Developer Tools','AI coding assistants, code review and developer productivity tools.','Coding assistants suggest code, explain errors, write tests and help you learn new languages. Each listing explains which editors it supports and what the free plan allows. Always review and test generated code.','code',60),
('tool','study','Study & Education','AI tools for note taking, flashcards, research reading and tutoring.','Study tools turn lectures, PDFs and notes into summaries, flashcards and practice questions. They are most useful when you check the output against your source material and use them to practise recall, not to replace reading.','graduation-cap',70),
('tool','productivity','Productivity & Automation','Meeting notes, task planning, workflow automation and knowledge tools.','Productivity tools capture meeting notes, organise tasks, search your documents and automate repetitive steps. Each listing explains what it connects to and whether the free plan is enough for personal use.','list-checks',80),
('tool','career','Resume & Career','Resume checkers, interview practice and job search helpers.','Career tools help you improve a resume, practise interviews and organise a job search. Treat automated scores as hints rather than verdicts, and never let a tool invent experience for you.','briefcase',90),
('tool','design','Design & Presentations','AI tools for slides, graphics, logos and brand assets.','Design tools help non-designers build slides, social graphics and brand assets quickly. Check licensing and export options before using designs commercially.','palette',100),
('tool','research','Research & Knowledge','AI search, paper reading and fact-finding tools.','Research tools answer questions with sources, summarise papers and help you explore a new topic. Always open the cited sources and confirm important facts yourself.','search',110),
('tool','marketing','Marketing & SEO','Tools for content planning, keyword research, ads and analytics.','Marketing tools help with content ideas, keyword research, ad copy and reporting. Their suggestions are starting points: test them against your own audience data.','trending-up',120),

('blog','ai-for-students','AI for Students','Practical ways students can use AI to learn better.','','graduation-cap',10),
('blog','prompt-engineering','Prompt Engineering','How to write clear prompts and get reliable results.','','sparkles',20),
('blog','careers-resume','Careers & Resume','Resume writing, interviews and job search guides.','','briefcase',30),
('blog','ai-tools-guides','AI Tools Guides','Comparisons and how-to guides for AI tools.','','wrench',40),
('blog','productivity','Productivity','Systems and routines that save time.','','list-checks',50)
on conflict (kind, slug) do nothing;

-- 9) Default public settings ----------------------------------------------------
insert into public.pz_settings (key, value) values
('ads_txt', '{"text": ""}'),
('home_sections', '{"stats": true, "categories": true, "prompts": true, "tools": true, "resume": true, "guides": true, "faq": true}'),
('resume', '{"hidden": [], "featured": []}')
on conflict (key) do nothing;

-- ===== merged patches 0-2 (idempotent) =====
-- Newsletter subscribers: anyone can subscribe (insert only); only the admin can read/delete.
create table if not exists public.pz_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  source text not null default 'site',
  created_at timestamptz not null default now()
);
alter table public.pz_subscribers enable row level security;
grant insert on public.pz_subscribers to anon, authenticated;
grant select, delete on public.pz_subscribers to authenticated;
drop policy if exists "pz anyone subscribe" on public.pz_subscribers;
create policy "pz anyone subscribe" on public.pz_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "pz admin read subscribers" on public.pz_subscribers;
create policy "pz admin read subscribers" on public.pz_subscribers for select to authenticated using (public.pz_is_admin());
drop policy if exists "pz admin delete subscribers" on public.pz_subscribers;
create policy "pz admin delete subscribers" on public.pz_subscribers for delete to authenticated using (public.pz_is_admin());
-- Promptzyra v2 patch 1: prompt types (text/image), example image, subcategory. Safe to run more than once.
alter table public.pz_prompts add column if not exists type text not null default 'text';
alter table public.pz_prompts add column if not exists example_image_url text not null default '';
alter table public.pz_prompts add column if not exists subcategory text not null default '';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'pz_prompts_type_check') then
    alter table public.pz_prompts add constraint pz_prompts_type_check check (type in ('text','image'));
  end if;
end $$;
create index if not exists pz_prompts_type_idx on public.pz_prompts (type);
create index if not exists pz_prompts_audience_idx on public.pz_prompts (audience);
create index if not exists pz_prompts_subcategory_idx on public.pz_prompts (subcategory);
-- Blog: image alt text + featured flag (safe to re-run)
alter table public.promptzyra_posts add column if not exists image_alt text default '';
alter table public.promptzyra_posts add column if not exists featured boolean default false;
-- Adds the "AI for Teachers" blog category (idempotent)
insert into public.pz_categories (kind, slug, name, description, icon, sort_order)
values ('blog','ai-for-teachers','AI for Teachers','Lesson planning, assessment and classroom workflows with AI.','school',60)
on conflict (kind, slug) do nothing;

-- ===== merged patch 4 (photo prompts) =====
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

-- ===== merged patch 5 (og_image) =====
-- Patch 5: og_image (Open Graph / social share image, 1200x630) for every content table.
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.
alter table public.pz_prompts       add column if not exists og_image text not null default '';
alter table public.pz_tools         add column if not exists og_image text not null default '';
alter table public.pz_photo_prompts add column if not exists og_image text not null default '';
alter table public.promptzyra_posts add column if not exists og_image text not null default '';

-- Make PostgREST pick up the new columns immediately.
notify pgrst, 'reload schema';
