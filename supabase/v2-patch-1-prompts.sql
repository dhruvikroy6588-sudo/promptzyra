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
