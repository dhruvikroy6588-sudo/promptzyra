-- Blog: image alt text + featured flag (safe to re-run)
alter table public.promptzyra_posts add column if not exists image_alt text default '';
alter table public.promptzyra_posts add column if not exists featured boolean default false;
