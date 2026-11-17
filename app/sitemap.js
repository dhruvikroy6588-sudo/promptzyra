import posterPrompts from '@/data/poster-prompts.json';
import { SITE_URL } from '@/lib/site';
import { allSlugs, getCategories, promptAudiences } from '@/lib/data';
import { PHOTO_TOOLS, PHOTO_SUBJECTS } from '@/lib/photo';
import { getSupabaseServer } from '@/lib/supabase-server';
import { CATEGORIES } from '@/lib/resume/templates';
export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const u = (p, d, f = 'weekly', pr = 0.6) => ({ url: `${SITE_URL}${p}`, lastModified: d ? new Date(d) : new Date(), changeFrequency: f, priority: pr });
  const fixed = [u('/', null, 'daily', 1), u('/prompts', null, 'daily', 0.9), u('/photo-prompts', null, 'daily', 0.9), ...PHOTO_TOOLS.map((t) => u(`/photo-prompts/tool/${t.id}`, null, 'weekly', 0.5)), ...PHOTO_SUBJECTS.map((s) => u(`/photo-prompts/for/${s.id}`, null, 'weekly', 0.5)), u('/ai-tools', null, 'daily', 0.9), u('/resume-builder', null, 'weekly', 0.9), u('/resume-templates', null, 'weekly', 0.8), u('/blog', null, 'daily', 0.8), u('/trending', null, 'daily', 0.7), u('/tools', null, 'weekly', 0.7),
    ...['cover-letter-builder', 'ats-resume-checker', 'prompt-builder', 'study-planner'].map((s) => u(`/${s}`, null, 'monthly', 0.7)),
    ...['about', 'contact', 'privacy-policy', 'terms', 'disclaimer', 'editorial-policy', 'advertising-disclosure', 'cookie-policy', 'ai-policy', 'faq', 'how-it-works', 'site-map'].map((s) => u(`/${s}`, null, 'yearly', 0.3)),
    ...CATEGORIES.map((c) => u(`/resume-templates/${c.slug}`, null, 'monthly', 0.6)),
    ...['/free-guides', ...['free','freemium','free-trial','paid','open-source'].map((t) => `/ai-tools/pricing/${t}`), ...['chatgpt','claude','gemini','copilot','grok','deepseek','midjourney'].map((m) => `/prompts/model/${m}`), '/image-prompt-generator', '/image-prompts', '/poster-prompts', '/gemini-watermark-remover'].map((p) => u(p, null, 'monthly', 0.4))];
  const [pcats, tcats, bcats, prompts, tools, auds, phcats, photos] = await Promise.all([getCategories('prompt'), getCategories('tool'), getCategories('blog'), allSlugs('pz_prompts'), allSlugs('pz_tools'), promptAudiences(), getCategories('photo'), allSlugs('pz_photo_prompts')]);
  const sb = getSupabaseServer(); let posts = [];
  if (sb) { const { data } = await sb.from('promptzyra_posts').select('slug,kind,updated_at,created_at').eq('published', true).limit(5000); posts = data || []; }
  const blogKinds = ['blog', 'Blog', 'SEO guide', 'Gemini watermark guide'];
  return [
    ...fixed,
    ...auds.map((a) => u(`/prompts/for/${a.slug}`, null, 'weekly', 0.5)),
    ...pcats.map((c) => u(`/prompts/category/${c.slug}`, null, 'daily', 0.7)),
    ...tcats.map((c) => u(`/ai-tools/category/${c.slug}`, null, 'daily', 0.7)),
    ...bcats.map((c) => u(`/blog/category/${c.slug}`, null, 'weekly', 0.5)),
    ...phcats.map((c) => u(`/photo-prompts/category/${c.slug}`, null, 'weekly', 0.6)),
    ...photos.map((p) => u(`/photo-prompts/${p.slug}`, p.updated_at || p.created_at, 'monthly', 0.7)),
    ...prompts.map((p) => u(`/prompts/${p.slug}`, p.updated_at || p.created_at, 'monthly', 0.7)),
    ...tools.map((t) => u(`/ai-tools/${t.slug}`, t.updated_at || t.created_at, 'monthly', 0.7)),
    ...posts.map((p) => u(`/${blogKinds.includes(p.kind) ? 'blog' : 'prompt'}/${p.slug}`, p.updated_at || p.created_at, 'monthly', 0.6)),
    ...posterPrompts.map((p) => u(`/poster-prompts/${p.slug}`, '2026-10-31', 'monthly', 0.4)),
  ];
}
