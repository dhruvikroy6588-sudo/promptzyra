# Promptzyra production setup (Cloudflare + Supabase)

This package updates the Promptzyra frontend/admin. **It does not automatically deploy itself**; upload/commit these files to the existing `dhruvikroy6588-sudo/promptzyra` repo and let the configured Cloudflare build deploy.

## 1) Cloudflare build variables

In Cloudflare Workers & Pages → `promptzyra` → Builds → Build configuration / environment variables, add these at **build time** (not only runtime):

- `NEXT_PUBLIC_SUPABASE_URL` = `https://hlcxuerdoxgytykiwmwk.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = the Promptzyra project's publishable key.

Do not add a Supabase secret/service-role key to the frontend or `NEXT_PUBLIC_*` variables. Redeploy after adding variables.

## 2) Supabase SQL

Open the Promptzyra project SQL Editor and run the following. This is scoped to Promptzyra only; do not run it in EPSNIX.

```sql
create table if not exists public.promptzyra_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null default 'AI Photo Trends',
  excerpt text not null default '',
  prompt text not null default '',
  content text default '',
  keywords text default '',
  tags text[] not null default '{}',
  image1 text default '',
  image2 text default '',
  thumbnail text default '',
  author text default 'Promptzyra Team',
  read_time text default '4 min read',
  kind text default 'Prompt guide',
  tips text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promptzyra_posts enable row level security;
grant select on public.promptzyra_posts to anon, authenticated;
grant insert, update, delete on public.promptzyra_posts to authenticated;

drop policy if exists "Anyone can read published Promptzyra posts" on public.promptzyra_posts;
create policy "Anyone can read published Promptzyra posts" on public.promptzyra_posts
for select to anon, authenticated using (published = true);
drop policy if exists "Admin can read all Promptzyra posts" on public.promptzyra_posts;
create policy "Admin can read all Promptzyra posts" on public.promptzyra_posts
for select to authenticated using ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Admin can create Promptzyra posts" on public.promptzyra_posts;
create policy "Admin can create Promptzyra posts" on public.promptzyra_posts
for insert to authenticated with check ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Admin can update Promptzyra posts" on public.promptzyra_posts;
create policy "Admin can update Promptzyra posts" on public.promptzyra_posts
for update to authenticated using ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com')
with check ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Admin can delete Promptzyra posts" on public.promptzyra_posts;
create policy "Admin can delete Promptzyra posts" on public.promptzyra_posts
for delete to authenticated using ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('promptzyra-images', 'promptzyra-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = 8388608;

drop policy if exists "Public can view Promptzyra images" on storage.objects;
create policy "Public can view Promptzyra images" on storage.objects
for select to anon, authenticated using (bucket_id = 'promptzyra-images');
drop policy if exists "Promptzyra admin uploads images" on storage.objects;
create policy "Promptzyra admin uploads images" on storage.objects
for insert to authenticated with check (bucket_id = 'promptzyra-images' and (auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Promptzyra admin updates images" on storage.objects;
create policy "Promptzyra admin updates images" on storage.objects
for update to authenticated using (bucket_id = 'promptzyra-images' and (auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com')
with check (bucket_id = 'promptzyra-images' and (auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Promptzyra admin deletes images" on storage.objects;
create policy "Promptzyra admin deletes images" on storage.objects
for delete to authenticated using (bucket_id = 'promptzyra-images' and (auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
```

If the table already exists, `CREATE TABLE IF NOT EXISTS` will not add missing columns. Compare its columns with the list above and add any missing columns before testing.


## 2A) Persistent category manager (required for add / rename / delete)

Run this in the **Promptzyra** SQL Editor after the posts table setup above. It creates a dedicated category table so category changes persist across reloads.

```sql
create table if not exists public.promptzyra_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);
alter table public.promptzyra_categories enable row level security;
grant select on public.promptzyra_categories to anon, authenticated;
grant insert, update, delete on public.promptzyra_categories to authenticated;

drop policy if exists "Public can read Promptzyra categories" on public.promptzyra_categories;
create policy "Public can read Promptzyra categories" on public.promptzyra_categories
for select to anon, authenticated using (true);
drop policy if exists "Promptzyra admin adds categories" on public.promptzyra_categories;
create policy "Promptzyra admin adds categories" on public.promptzyra_categories
for insert to authenticated with check ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Promptzyra admin renames categories" on public.promptzyra_categories;
create policy "Promptzyra admin renames categories" on public.promptzyra_categories
for update to authenticated using ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com')
with check ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');
drop policy if exists "Promptzyra admin deletes categories" on public.promptzyra_categories;
create policy "Promptzyra admin deletes categories" on public.promptzyra_categories
for delete to authenticated using ((auth.jwt() ->> 'email') = 'dhruvikroy6588@gmail.com');

insert into public.promptzyra_categories (name) values
('AI Photo Trends'),('AI Art & Design'),('Seasonal & Festivals'),('Portrait Prompts'),('Video & Reels'),('Product Photography'),('SEO Guides')
on conflict (name) do nothing;
```

## 3) Supabase Google provider and URL settings

- Authentication → Providers → Google enabled with your Google OAuth Web Client ID and Client Secret.
- Google OAuth authorized redirect URI must be exactly `https://hlcxuerdoxgytykiwmwk.supabase.co/auth/v1/callback`.
- Authentication → URL Configuration: Site URL `https://promptzyra.com`; Redirect URLs include `https://promptzyra.com/**`.
- Google OAuth Audience test user list should include only `dhruvikroy6588@gmail.com` while the app is in Testing mode.

## 4) Security notes

- The admin UI checks the signed-in email, and Supabase RLS independently restricts database writes and private draft reads to `dhruvikroy6588@gmail.com`.
- Do not rely on the frontend gate alone; keep RLS enabled.
- A public bucket means published image URLs are public. Only the exact admin email can upload/update/delete objects in this bucket.
- Because the Google OAuth secret was visible in a screenshot shared during setup, rotate the OAuth client secret in Google Cloud and update Supabase's Google provider secret.

## 5) Test checklist after deployment

1. Visit `/admin`; without login, the content editor should not appear.
2. Sign in with `dhruvikroy6588@gmail.com`; verify the account email shown in the sidebar.
3. Sign in with a different Google account in a separate browser/profile; it must not access admin content or write to the database.
4. Create a draft, reload `/admin`, and verify it persists. Publish it and verify it appears on the home page.
5. Create a prompt or blog in Admin. The main image you upload is the exact card thumbnail and detail hero; no bundled demo SVG is used as a fallback. Before/after images are optional and appear only when both are uploaded. Verify public image URLs load and test copy/search/category filters on desktop and mobile.
6. For blog posts, choose `SEO guide` or `Gemini watermark guide`, write original body copy (at least 500 characters to publish), use `## Heading` lines for section headings and separate paragraphs with blank lines. Save as Draft until the article is complete.
6. Check `/sitemap.xml`, `/robots.txt`, favicon and individual blog metadata.

## Gemini watermark tool note

The included Gemini watermark page is educational guidance, not a guaranteed automatic watermark-removal engine. Do not describe it as removing Google's invisible SynthID/provenance watermark. Use only images you own or are authorized to edit. This package does not bundle an unverified third-party watermark-removal library.
