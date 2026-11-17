// Server-side data access for the public site. Uses the anon key; Supabase RLS guarantees that
// only published (or scheduled-and-due) rows can ever be returned here.
import { getSupabaseServer } from './supabase-server';
import { defaultCategories } from './taxonomy-defaults';
import { PAGE_SIZE } from './site';

export { BLOG_KINDS } from './blog-kinds';
import { BLOG_KINDS as _BK } from './blog-kinds';

const safe = async (fn, fallback) => {
  try { return await fn(); } catch (e) { console.error('[data]', e?.message || e); return fallback; }
};
export const cleanQuery = (q) => String(q || '').trim().replace(/[%,()*\\:]/g, ' ').replace(/\s+/g, ' ').slice(0, 80);
const orSearch = (cols, q) => cols.map((c) => `${c}.ilike.%${q}%`).join(',');

/* ---------- categories ---------- */
export async function getCategories(kind) {
  const rows = await safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return [];
    const { data, error } = await sb.from('pz_categories').select('slug,name,description,intro,icon,sort_order').eq('kind', kind).order('sort_order').order('name');
    if (error) throw error;
    return data || [];
  }, []);
  if (rows.length) return rows;
  return (defaultCategories[kind] || []).map(([slug, name, description, icon], i) => ({ slug, name, description, intro: '', icon, sort_order: (i + 1) * 10 }));
}
export async function getCategory(kind, slug) {
  const all = await getCategories(kind);
  return all.find((c) => c.slug === slug) || null;
}

/* ---------- counts ---------- */
async function counts(fn) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return {};
    const { data, error } = await sb.rpc(fn);
    if (error) throw error;
    const map = {};
    let total = 0;
    (data || []).forEach((r) => { map[r.category] = Number(r.n); total += Number(r.n); });
    map.__total = total;
    return map;
  }, {});
}
export const promptCounts = () => counts('pz_prompt_counts');
export const toolCounts = () => counts('pz_tool_counts');

/* ---------- prompts ---------- */
const PROMPT_LIST_COLS = 'slug,title,summary,category,models,level,audience,tags,copy_count,featured,prompt,publish_at,created_at,updated_at';

const PROMPT_EXTRA_COLS = ',type,subcategory,example_image_url';
export const slugifyAud = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function listPrompts({ category, q, model, level, sort = 'popular', page = 1, pageSize = PAGE_SIZE, featured, type, audience, sub } = {}) {
  const run = async (extended) => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('pz_prompts').select(PROMPT_LIST_COLS + (extended ? PROMPT_EXTRA_COLS : ''), { count: 'exact' });
    if (category) query = query.eq('category', category);
    if (model) query = query.contains('models', [model]);
    if (level) query = query.eq('level', level);
    if (featured) query = query.eq('featured', true);
    if (audience) query = query.ilike('audience', audience);
    if (extended && type) query = query.eq('type', type);
    if (extended && sub) query = query.eq('subcategory', sub);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['title', 'summary'], term));
    if (sort === 'title') query = query.order('title', { ascending: true });
    else if (sort === 'copied') query = query.order('copy_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    else if (sort === 'latest') query = query.order('publish_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
    else query = query.order('featured', { ascending: false }).order('copy_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    const from = (Math.max(1, page) - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  };
  // falls back to the base columns if v2-patch-1-prompts.sql has not been run yet
  return safe(async () => { try { return await run(true); } catch (e) { return await run(false); } }, { rows: [], total: 0 });
}

// Distinct audience values of published prompts, with counts (for filters and /prompts/for/[audience]).
export async function promptAudiences() {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return [];
    const { data, error } = await sb.from('pz_prompts').select('audience').neq('audience', '').limit(5000);
    if (error) throw error;
    const m = new Map();
    (data || []).forEach((r) => { const a = String(r.audience || '').trim(); if (a) m.set(a, (m.get(a) || 0) + 1); });
    return [...m.entries()].map(([name, n]) => ({ name, slug: slugifyAud(name), n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  }, []);
}

// Distinct subcategories inside one category.
export async function promptSubcategories(category) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !category) return [];
    const { data, error } = await sb.from('pz_prompts').select('subcategory').eq('category', category).neq('subcategory', '').limit(3000);
    if (error) return [];
    const m = new Map();
    (data || []).forEach((r) => { const a = String(r.subcategory || '').trim(); if (a) m.set(a, (m.get(a) || 0) + 1); });
    return [...m.entries()].map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n);
  }, []);
}

export async function getPrompt(slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('pz_prompts').select('*').eq('slug', slug).maybeSingle();
    return data || null;
  }, null);
}

export async function relatedPrompts(p, n = 6) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !p) return [];
    const { data } = await sb.from('pz_prompts').select(PROMPT_LIST_COLS).eq('category', p.category).neq('slug', p.slug).order('copy_count', { ascending: false }).limit(n);
    return data || [];
  }, []);
}

/* ---------- tools ---------- */
const TOOL_LIST_COLS = 'slug,name,tagline,category,pricing,best_for,platforms,tags,logo_url,featured,website_url,last_checked,publish_at,created_at,updated_at';

export async function listTools({ category, q, pricing, platform, sort = 'featured', page = 1, pageSize = PAGE_SIZE, featured } = {}) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('pz_tools').select(TOOL_LIST_COLS, { count: 'exact' });
    if (category) query = query.eq('category', category);
    if (pricing) query = query.eq('pricing', pricing);
    if (platform) query = query.contains('platforms', [String(platform).slice(0, 40)]);
    if (featured) query = query.eq('featured', true);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['name', 'tagline', 'best_for'], term));
    // slug is the final tie-breaker so server-side pages never overlap or skip rows
    if (sort === 'name') query = query.order('name', { ascending: true }).order('slug');
    else if (sort === 'latest') query = query.order('publish_at', { ascending: false, nullsFirst: false }).order('slug');
    else query = query.order('featured', { ascending: false }).order('name', { ascending: true }).order('slug');
    page = Math.min(Math.max(1, parseInt(page) || 1), 5000);
    const from = (page - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  }, { rows: [], total: 0 });
}

export async function getTool(slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('pz_tools').select('*').eq('slug', slug).maybeSingle();
    return data || null;
  }, null);
}

export async function toolsBySlugs(slugs = []) {
  if (!slugs.length) return [];
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return [];
    const { data } = await sb.from('pz_tools').select(TOOL_LIST_COLS).in('slug', slugs.slice(0, 8));
    return data || [];
  }, []);
}

export async function relatedTools(t, n = 6) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !t) return [];
    const { data } = await sb.from('pz_tools').select(TOOL_LIST_COLS).eq('category', t.category).neq('slug', t.slug).order('featured', { ascending: false }).limit(n);
    return data || [];
  }, []);
}

/* ---------- blog ---------- */
const BLOG_COLS_BASE = 'id,slug,title,excerpt,category,tags,thumbnail,image1,image2,author,read_time,kind,created_at,updated_at,publish_at,seo_title,seo_description';
const BLOG_COLS = BLOG_COLS_BASE + ',image_alt,featured';

export async function listBlog({ category, q, page = 1, pageSize = 12, sort = 'newest', excludeSlug } = {}) {
  const run = async (cols) => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('promptzyra_posts').select(cols, { count: 'exact' }).in('kind', _BK);
    if (category) query = query.eq('category', category);
    if (excludeSlug) query = query.neq('slug', excludeSlug);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['title', 'excerpt'], term));
    const asc = sort === 'oldest';
    query = query.order('publish_at', { ascending: asc, nullsFirst: asc }).order('created_at', { ascending: asc });
    const from = (Math.max(1, page) - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  };
  // falls back to the base columns if the v2-patch-2-blog.sql migration has not been run yet
  return safe(async () => { try { return await run(BLOG_COLS); } catch (e) { return await run(BLOG_COLS_BASE); } }, { rows: [], total: 0 });
}

export async function getFeaturedPost() {
  const run = async (featuredOnly) => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    let query = sb.from('promptzyra_posts').select(BLOG_COLS).in('kind', _BK);
    if (featuredOnly) query = query.eq('featured', true);
    const { data, error } = await query.order('publish_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }).limit(1);
    if (error) throw error;
    return data?.[0] || null;
  };
  return safe(async () => {
    try { const f = await run(true); if (f) return f; } catch (e) { /* column missing: fall through */ }
    try { return await run(false); } catch (e) {
      const sb = getSupabaseServer(); if (!sb) return null;
      const { data } = await sb.from('promptzyra_posts').select(BLOG_COLS_BASE).in('kind', _BK).order('created_at', { ascending: false }).limit(1);
      return data?.[0] || null;
    }
  }, null);
}

export async function getPost(slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('promptzyra_posts').select('*').eq('slug', slug).in('kind', _BK).maybeSingle();
    return data || null;
  }, null);
}

export async function relatedPosts(post, n = 3) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !post) return [];
    const { data } = await sb.from('promptzyra_posts').select(BLOG_COLS_BASE).in('kind', _BK).neq('slug', post.slug).order('created_at', { ascending: false }).limit(n);
    return data || [];
  }, []);
}

/* ---------- blog -> related prompts / tools ---------- */
const STOP = new Set('the and for with from that this your you are how what why when best top guide tips using use into about more most free ai a an to of in on is it be can will'.split(' '));
function postKeywords(post) {
  const tags = Array.isArray(post?.tags) ? post.tags : String(post?.tags || '').split(',');
  const words = [...tags, post?.category || '', post?.title || ''].join(' ').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));
  return [...new Set(words)].slice(0, 24);
}
const scoreRow = (row, kws, fields) => {
  const hay = fields.map((f) => (Array.isArray(row[f]) ? row[f].join(' ') : String(row[f] || ''))).join(' ').toLowerCase();
  return kws.reduce((s, k) => s + (hay.includes(k) ? 1 : 0), 0);
};
export async function relatedPromptsForPost(post, n = 3) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !post) return [];
    const { data } = await sb.from('pz_prompts').select(PROMPT_LIST_COLS).order('copy_count', { ascending: false }).limit(150);
    const rows = data || [];
    const kws = postKeywords(post);
    const scored = rows.map((r) => ({ r, s: scoreRow(r, kws, ['title', 'tags', 'category', 'summary']) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || (b.r.copy_count || 0) - (a.r.copy_count || 0)).map((x) => x.r);
    const out = scored.slice(0, n);
    for (const r of rows) { if (out.length >= n) break; if (!out.includes(r)) out.push(r); }
    return out;
  }, []);
}
export async function relatedToolsForPost(post, n = 3) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !post) return [];
    const { data } = await sb.from('pz_tools').select(TOOL_LIST_COLS).order('featured', { ascending: false }).limit(100);
    const rows = data || [];
    const kws = postKeywords(post);
    const scored = rows.map((r) => ({ r, s: scoreRow(r, kws, ['name', 'tags', 'category', 'tagline', 'best_for']) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || (b.r.featured ? 1 : 0) - (a.r.featured ? 1 : 0)).map((x) => x.r);
    const out = scored.slice(0, n);
    for (const r of rows) { if (out.length >= n) break; if (!out.includes(r)) out.push(r); }
    return out;
  }, []);
}

/* ---------- photo prompts ---------- */
const PHOTO_LIST_COLS = 'slug,title,summary,category,tool,subject,style,tags,image_url,image_alt,featured,copy_count,publish_at,created_at,updated_at';
export const photoCounts = () => counts('pz_photo_counts');

export async function listPhotoPrompts({ category, tool, subject, q, sort = 'popular', page = 1, pageSize = 24, featured } = {}) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('pz_photo_prompts').select(PHOTO_LIST_COLS, { count: 'exact' });
    if (category) query = query.eq('category', category);
    if (tool) query = query.in('tool', [tool, 'any']);
    if (subject) query = query.eq('subject', subject);
    if (featured) query = query.eq('featured', true);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['title', 'summary', 'style'], term));
    if (sort === 'latest') query = query.order('publish_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
    else query = query.order('featured', { ascending: false }).order('copy_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    const from = (Math.max(1, page) - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  }, { rows: [], total: 0 });
}

export async function getPhotoPrompt(slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('pz_photo_prompts').select('*').eq('slug', slug).maybeSingle();
    return data || null;
  }, null);
}

export async function relatedPhotoPrompts(p, n = 6) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !p) return [];
    let query = sb.from('pz_photo_prompts').select(PHOTO_LIST_COLS).neq('slug', p.slug);
    query = p.category ? query.eq('category', p.category) : query;
    const { data } = await query.order('copy_count', { ascending: false }).limit(n);
    return data || [];
  }, []);
}

/* ---------- skills ---------- */
// List queries never return skill_md. references_md is selected only to compute `files` (1 or 2) and is dropped before returning.
const SKILL_LIST_COLS = 'slug,name,description,category,tags,audience,level,featured,copy_count,publish_at,created_at,updated_at,references_md';
const slimSkill = ({ references_md, ...r }) => ({ ...r, files: references_md && String(references_md).trim() ? 2 : 1 });
export const skillCounts = () => counts('pz_skill_counts');

export async function listSkills({ category, q, level, audience, sort = 'popular', page = 1, pageSize = 24, featured } = {}) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('pz_skills').select(SKILL_LIST_COLS, { count: 'exact' });
    if (category) query = query.eq('category', category);
    if (level) query = query.eq('level', level);
    if (audience) query = query.ilike('audience', audience);
    if (featured) query = query.eq('featured', true);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['name', 'description'], term));
    if (sort === 'name') query = query.order('name', { ascending: true });
    else if (sort === 'copied') query = query.order('copy_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    else if (sort === 'latest') query = query.order('publish_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
    else query = query.order('featured', { ascending: false }).order('copy_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    const from = (Math.max(1, page) - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: (data || []).map(slimSkill), total: count || 0 };
  }, { rows: [], total: 0 });
}

export async function getSkill(slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('pz_skills').select('*').eq('slug', slug).maybeSingle();
    return data || null;
  }, null);
}

export async function relatedSkills(skill, n = 6) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !skill) return [];
    let query = sb.from('pz_skills').select(SKILL_LIST_COLS).neq('slug', skill.slug);
    if (skill.category) query = query.eq('category', skill.category);
    const { data } = await query.order('copy_count', { ascending: false }).limit(n);
    return (data || []).map(slimSkill);
  }, []);
}

/* ---------- components (agents, commands, settings, hooks, mcps, mods, plugins) ---------- */
const COMP_LIST_COLS = 'type,slug,name,description,category,tags,author,github_url,stars,level,featured,copy_count,publish_at,created_at,updated_at,files';
const slimComp = ({ files, ...r }) => ({ ...r, files: Array.isArray(files) ? files.length : 0 });
export async function componentCounts() {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return {};
    const { data, error } = await sb.rpc('pz_component_counts');
    if (error) throw error;
    const map = {}; (data || []).forEach((r) => { map[r.category] = Number(r.n); });
    return map;
  }, {});
}
export async function listComponents({ type, category, q, sort = 'popular', page = 1, pageSize = 24 } = {}) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('pz_components').select(COMP_LIST_COLS, { count: 'exact' }).eq('type', type);
    if (category) query = query.eq('category', category);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['name', 'description', 'author'], term));
    if (sort === 'name') query = query.order('name', { ascending: true });
    else if (sort === 'stars') query = query.order('stars', { ascending: false }).order('copy_count', { ascending: false });
    else if (sort === 'latest') query = query.order('publish_at', { ascending: false, nullsFirst: false });
    else query = query.order('featured', { ascending: false }).order('copy_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    const from = (Math.max(1, page) - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: (data || []).map(slimComp), total: count || 0 };
  }, { rows: [], total: 0 });
}
export async function getComponent(type, slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('pz_components').select('*').eq('type', type).eq('slug', slug).maybeSingle();
    return data || null;
  }, null);
}
export async function relatedComponents(c, n = 3) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !c) return [];
    const { data } = await sb.from('pz_components').select(COMP_LIST_COLS).eq('type', c.type).neq('slug', c.slug).order('copy_count', { ascending: false }).limit(n);
    return (data || []).map(slimComp);
  }, []);
}

/* ---------- courses ---------- */
const COURSE_COLS = 'slug,title,provider,description,category,level,cost,format,language,duration,url,tags,featured,click_count,publish_at,created_at,updated_at';
export async function courseCounts() {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return { __total: 0 };
    const { data, error } = await sb.rpc('pz_course_counts');
    if (error) throw error;
    const map = {}; let t = 0; (data || []).forEach((r) => { map[r.category] = Number(r.n); t += Number(r.n); }); map.__total = t; return map;
  }, { __total: 0 });
}
export async function listCourses({ category, cost, format, level, q, sort = 'popular', page = 1, pageSize = 24 } = {}) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return { rows: [], total: 0 };
    let query = sb.from('pz_courses').select(COURSE_COLS, { count: 'exact' });
    if (category) query = query.eq('category', category);
    if (cost) query = query.eq('cost', cost);
    if (format) query = query.eq('format', format);
    if (level) query = query.eq('level', level);
    const term = cleanQuery(q);
    if (term) query = query.or(orSearch(['title', 'description', 'provider'], term));
    if (sort === 'name') query = query.order('title', { ascending: true });
    else if (sort === 'latest') query = query.order('publish_at', { ascending: false, nullsFirst: false });
    else query = query.order('featured', { ascending: false }).order('click_count', { ascending: false }).order('publish_at', { ascending: false, nullsFirst: false });
    const from = (Math.max(1, page) - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  }, { rows: [], total: 0 });
}
export async function getCourse(slug) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data } = await sb.from('pz_courses').select('*').eq('slug', slug).maybeSingle();
    return data || null;
  }, null);
}
export async function relatedCourses(c, n = 3) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb || !c) return [];
    const { data } = await sb.from('pz_courses').select(COURSE_COLS).eq('category', c.category).neq('slug', c.slug).order('click_count', { ascending: false }).limit(n);
    return data || [];
  }, []);
}

/* ---------- settings ---------- */
export async function getSetting(key, fallback = {}) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return fallback;
    const { data } = await sb.from('pz_settings').select('value').eq('key', key).maybeSingle();
    return data?.value ?? fallback;
  }, fallback);
}

/* ---------- search + sitemap ---------- */
export async function searchAll(q) {
  const term = cleanQuery(q);
  if (term.length < 2) return { prompts: [], tools: [], posts: [] };
  const [prompts, tools, posts] = await Promise.all([
    listPrompts({ q: term, pageSize: 12, sort: 'popular' }),
    listTools({ q: term, pageSize: 12 }),
    listBlog({ q: term, pageSize: 6 }),
  ]);
  return { prompts: prompts.rows, tools: tools.rows, posts: posts.rows };
}

export async function allSlugs(table, extra = (q) => q) {
  return safe(async () => {
    const sb = getSupabaseServer();
    if (!sb) return [];
    const out = [];
    for (let from = 0; from < 20000; from += 1000) {
      let query = sb.from(table).select('slug,updated_at,created_at,publish_at,category');
      query = extra(query);
      const { data, error } = await query.range(from, from + 999);
      if (error) throw error;
      out.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    return out;
  }, []);
}
