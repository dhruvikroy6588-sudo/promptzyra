-- Promptzyra v2 patch 8: photo section has ONE category, 'ai-photo-trends' (idempotent, safe to re-run).
insert into public.pz_categories (kind, slug, name, description, intro, icon, sort_order) values
('photo','ai-photo-trends','AI Photo Trends','Ready-made prompts for popular AI photo styles you can apply to your own picture.','','camera',10)
on conflict (kind, slug) do nothing;

update public.pz_photo_prompts set category = 'ai-photo-trends' where category <> 'ai-photo-trends';

delete from public.pz_categories where kind = 'photo' and slug <> 'ai-photo-trends';
