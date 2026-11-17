-- Adds the "AI for Teachers" blog category (idempotent)
insert into public.pz_categories (kind, slug, name, description, icon, sort_order)
values ('blog','ai-for-teachers','AI for Teachers','Lesson planning, assessment and classroom workflows with AI.','school',60)
on conflict (kind, slug) do nothing;
