import { MODELS, LEVELS, PRICING } from '@/lib/site';
export const STATUSES = ['draft', 'reviewed', 'scheduled', 'published'];
export const PROMPT_FIELDS = [
  { k: 'title', l: 'Title', t: 'text', req: 1, hint: 'Clear and specific, 50–65 characters' },
  { k: 'slug', l: 'URL slug', t: 'slug' },
  { k: 'type', l: 'Prompt type', t: 'select', opts: ['text', 'image'] },
  { k: 'category', l: 'Category', t: 'cat', req: 1 },
  { k: 'subcategory', l: 'Subcategory (optional)', t: 'text', hint: 'e.g. Essays, Lesson plans' },
  { k: 'summary', l: 'Summary (meta description, 140–160 chars)', t: 'area', rows: 2 },
  { k: 'prompt', l: 'Prompt text — use {{variable}} for blanks', t: 'area', rows: 9, req: 1, mono: 1 },
  { k: 'when_to_use', l: 'When to use it', t: 'area', rows: 2 },
  { k: 'how_to_use', l: 'How to use — one step per line', t: 'area', rows: 4 },
  { k: 'example_output', l: 'Example of good output', t: 'area', rows: 4 },
  { k: 'tips', l: 'Tips — one per line', t: 'list', rows: 3 },
  { k: 'example_image_url', l: 'Example result image (for image prompts)', t: 'image' },
  { k: 'models', l: 'Works with', t: 'models' },
  { k: 'audience', l: 'Audience', t: 'text', hint: 'Student, Teacher, Job seeker…' },
  { k: 'level', l: 'Level', t: 'select', opts: LEVELS },
  { k: 'tags', l: 'Tags — comma separated', t: 'list', comma: 1 },
  { k: 'related_tools', l: 'Related tool slugs — comma separated', t: 'list', comma: 1 },
  { k: 'faq', l: 'FAQ (Q: … then A: … , blank line between)', t: 'faq' },
  { k: 'seo_title', l: 'SEO title (optional)', t: 'text' },
  { k: 'seo_description', l: 'SEO description (optional)', t: 'area', rows: 2 },
  { k: 'og_image', l: 'OG image URL (optional, 1200x630)', t: 'image' },
  { k: 'featured', l: 'Featured (shown first)', t: 'bool' },
];
export const TOOL_FIELDS = [
  { k: 'name', l: 'Tool name', t: 'text', req: 1 },
  { k: 'slug', l: 'URL slug', t: 'slug' },
  { k: 'tagline', l: 'One-line description', t: 'text' },
  { k: 'category', l: 'Category', t: 'cat', req: 1 },
  { k: 'description', l: 'Description — your own words, 150–250 words (blank line = new paragraph)', t: 'area', rows: 9 },
  { k: 'best_for', l: 'Best for', t: 'text' },
  { k: 'website_url', l: 'Official website URL', t: 'text' },
  { k: 'pricing', l: 'Pricing type', t: 'select', opts: PRICING },
  { k: 'last_checked', l: 'Last checked (date you verified pricing/features)', t: 'date' },
  { k: 'platforms', l: 'Platforms — comma separated', t: 'list', comma: 1 },
  { k: 'use_steps', l: 'How to get started — one step per line', t: 'list', rows: 4 },
  { k: 'pros', l: 'Strengths — one per line', t: 'list', rows: 3 },
  { k: 'cons', l: 'Limits — one per line', t: 'list', rows: 3 },
  { k: 'alternatives', l: 'Alternative tool slugs — comma separated', t: 'list', comma: 1 },
  { k: 'tags', l: 'Tags — comma separated', t: 'list', comma: 1 },
  { k: 'logo_url', l: 'Logo URL (optional)', t: 'image' },
  { k: 'seo_title', l: 'SEO title (optional)', t: 'text' },
  { k: 'seo_description', l: 'SEO description (optional)', t: 'area', rows: 2 },
  { k: 'og_image', l: 'OG image URL (optional, 1200x630)', t: 'image' },
  { k: 'featured', l: 'Featured', t: 'bool' },
];
export const PHOTO_TOOLS = ['any', 'gemini', 'chatgpt', 'midjourney'];
export const PHOTO_SUBJECTS = ['men', 'women', 'couple', 'family', 'kids', 'pets', 'birthday', 'portrait', 'other'];
export const PHOTO_FIELDS = [
  { k: 'title', l: 'Title', t: 'text', req: 1, hint: 'Clear and specific, 50–65 characters' },
  { k: 'slug', l: 'URL slug', t: 'slug' },
  { k: 'category', l: 'Category (photo)', t: 'cat', req: 1 },
  { k: 'tool', l: 'Best with', t: 'select', opts: PHOTO_TOOLS },
  { k: 'subject', l: 'Subject', t: 'select', opts: PHOTO_SUBJECTS },
  { k: 'style', l: 'Style', t: 'text', hint: 'e.g. Cinematic, Golden hour, Watercolor' },
  { k: 'summary', l: 'Summary (meta description, 140–160 chars)', t: 'area', rows: 2 },
  { k: 'prompt', l: 'Prompt text — use [your name] style placeholders', t: 'area', rows: 9, req: 1, mono: 1 },
  { k: 'tips', l: 'Tips — one per line', t: 'list', rows: 3 },
  { k: 'tags', l: 'Tags — comma separated', t: 'list', comma: 1 },
  { k: 'image_url', l: 'Example image (upload or paste URL)', t: 'image' },
  { k: 'image_alt', l: 'Image alt text', t: 'text' },
  { k: 'seo_title', l: 'SEO title (optional)', t: 'text' },
  { k: 'seo_description', l: 'SEO description (optional)', t: 'area', rows: 2 },
  { k: 'og_image', l: 'OG image URL (optional, 1200x630)', t: 'image' },
  { k: 'featured', l: 'Featured (shown first)', t: 'bool' },
];
export const MODEL_OPTS = MODELS;
export const toForm = (row, fields) => {
  const f = {};
  for (const fd of fields) {
    const v = row?.[fd.k];
    if (fd.t === 'list') f[fd.k] = Array.isArray(v) ? v.join(fd.comma ? ', ' : '\n') : '';
    else if (fd.t === 'models') f[fd.k] = Array.isArray(v) ? v : ['chatgpt', 'claude', 'gemini'];
    else if (fd.t === 'faq') f[fd.k] = (Array.isArray(v) ? v : []).map((x) => `Q: ${x.q}\nA: ${x.a}`).join('\n\n');
    else if (fd.t === 'bool') f[fd.k] = !!v;
    else f[fd.k] = v ?? (fd.t === 'select' ? fd.opts[0] : '');
  }
  return f;
};
export const fromForm = (form, fields) => {
  const o = {};
  for (const fd of fields) {
    const v = form[fd.k];
    if (fd.t === 'list') o[fd.k] = String(v || '').split(fd.comma ? /,/ : /\n/).map((s) => s.trim()).filter(Boolean);
    else if (fd.t === 'faq') o[fd.k] = String(v || '').split(/\n\s*\n/).map((b) => { const q = b.match(/^Q:\s*(.*)$/m)?.[1]?.trim(); const a = b.match(/^A:\s*([\s\S]*)$/m)?.[1]?.trim(); return q && a ? { q, a } : null; }).filter(Boolean);
    else if (fd.t === 'date') o[fd.k] = v || null;
    else o[fd.k] = v;
  }
  return o;
};
export const toLocalInput = (iso) => { if (!iso) return ''; const d = new Date(iso); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
export const fromLocalInput = (s) => (s ? new Date(s).toISOString() : null);
export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

export async function compressToWebp(file, maxW = 1600, q = 0.82) {
  const bmp = await createImageBitmap(file);
  const r = Math.min(1, maxW / bmp.width);
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * r); c.height = Math.round(bmp.height * r);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise((res) => c.toBlob(res, 'image/webp', q));
  if (!blob) throw new Error('This browser could not convert the image to WebP.');
  return new File([blob], 'image.webp', { type: 'image/webp' });
}
export async function uploadImage(file, token) {
  if (!file?.type?.startsWith('image/')) throw new Error('Choose an image file.');
  if (!token) throw new Error('Sign in again before uploading.');
  const f = await compressToWebp(file);
  const body = new FormData(); body.append('file', f);
  const r = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.url) throw new Error(j.error || `Upload failed (${r.status})`);
  return j.url;
}

// ---- R2 image helpers -------------------------------------------------------
const R2_URL_RE = /https?:\/\/[^\s)"'<>]+\/posts\/[0-9a-f-]{36}\.webp/g;
export const imageKeys = (fields) => fields.filter((f) => f.t === 'image').map((f) => f.k);
// All R2 image URLs found in the given columns of the given rows (also finds URLs embedded in long text such as post content).
export function collectR2Urls(rows, cols) {
  const out = new Set();
  for (const r of rows || []) for (const c of cols) { const v = r?.[c]; if (typeof v === 'string') (v.match(R2_URL_RE) || []).forEach((u) => out.add(u)); }
  return [...out];
}
// Old URLs that existed in `oldRow` but are no longer present in `newVals` (for replaced/removed images).
export const replacedR2Urls = (oldRow, newVals, cols) => collectR2Urls([oldRow], cols).filter((u) => !collectR2Urls([newVals], cols).includes(u));
// Deletes R2 objects for `urls` unless another row in `table` still uses them (server re-checks every table).
// Never throws: returns { msg, err } for a toast, or { msg: '' } when there was nothing to do.
export async function cleanupR2(sb, table, cols, urls) {
  const all = [...new Set(urls || [])];
  if (!all.length) return { msg: '' };
  try {
    const still = new Set();
    for (const c of cols) { const { data } = await sb.from(table).select(c).in(c, all); (data || []).forEach((r) => still.add(r[c])); }
    const todo = all.filter((u) => !still.has(u));
    if (!todo.length) return { msg: `${all.length} image(s) kept (still used elsewhere).` };
    const { data: s } = await sb.auth.getSession(); const token = s?.session?.access_token;
    if (!token) throw new Error('Sign in again.');
    let n = 0, kept = still.size; const bad = [];
    for (let i = 0; i < todo.length; i += 200) {
      const r = await fetch('/api/admin/r2', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', urls: todo.slice(i, i + 200) }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `R2 delete failed (${r.status})`);
      n += (j.deleted || []).length; kept += (j.skipped || []).length; bad.push(...(j.failed || []));
    }
    if (bad.length) return { msg: `Saved, but ${bad.length} image(s) could not be removed from R2. Use Settings > Storage cleanup to fix.`, err: true };
    return { msg: `${n} image(s) removed from R2${kept ? `, ${kept} kept (still in use)` : ''}.` };
  } catch (e) {
    return { msg: `Saved, but R2 image cleanup failed (${e.message}). Use Settings > Storage cleanup to fix.`, err: true };
  }
}

// ---- export helpers ---------------------------------------------------------
export function downloadFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
export function toCsv(rows) {
  const cols = [...new Set((rows || []).flatMap((r) => Object.keys(r)))];
  const esc = (v) => { const t = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return `"${t.replace(/"/g, '""')}"`; };
  return [cols.join(','), ...(rows || []).map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}
export const exportRows = (rows, base, fmt) => { const d = new Date().toISOString().slice(0, 10); if (fmt === 'json') downloadFile(`${base}-${d}.json`, JSON.stringify(rows, null, 2), 'application/json'); else downloadFile(`${base}-${d}.csv`, toCsv(rows), 'text/csv'); };
