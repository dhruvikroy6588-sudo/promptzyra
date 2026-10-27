# Promptzyra — 20 SEO Blog Drafts (2026 AI image trends)

## What this package contains
- `promptzyra-20-blog-drafts.sql`: inserts 20 original article drafts into `public.promptzyra_posts`.
- `promptzyra-20-blog-drafts.json`: a backup/import-ready content dataset.
- All records are unpublished (`published = false`).
- Image fields (`thumbnail`, `image1`, `image2`) are empty by design. Upload your own relevant images in Admin. This avoids fixed demo SVG placeholders.
- Each post includes title, SEO slug, keywords, meta description/excerpt, useful original content, copy-ready prompt, tags and practical tips.

## Before running SQL
1. Confirm the Promptzyra Supabase project is selected (project URL starts `https://hlcxuerdoxgytykiwmwk.supabase.co`).
2. Ensure `public.promptzyra_posts` exists with the columns in your project's SETUP.md.
3. Open SQL Editor, paste the SQL file, and run it.
4. The query uses `ON CONFLICT (slug) DO NOTHING`, so existing slugs are not overwritten.
5. Open `/admin`, review each draft, upload a featured thumbnail and optionally two supporting images, then publish only after proofreading.

## SEO and AdSense notes
These drafts are designed as helpful starting points, not a guarantee of Google rankings, traffic, or AdSense approval. Add real screenshots/examples from your own tests, verify tool-specific instructions, proofread each article, and do not publish content that has not been reviewed. Trend themes reflect a snapshot of available 2026 reporting and can change quickly.

## Important
Do not run this in EPSNIX. Do not place Supabase service-role/secret keys in client-side code or `NEXT_PUBLIC_*` variables.
