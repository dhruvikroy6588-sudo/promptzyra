-- Patch 5: og_image (Open Graph / social share image, 1200x630) for every content table.
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor.
alter table public.pz_prompts       add column if not exists og_image text not null default '';
alter table public.pz_tools         add column if not exists og_image text not null default '';
alter table public.pz_photo_prompts add column if not exists og_image text not null default '';
alter table public.promptzyra_posts add column if not exists og_image text not null default '';

-- Make PostgREST pick up the new columns immediately.
notify pgrst, 'reload schema';
