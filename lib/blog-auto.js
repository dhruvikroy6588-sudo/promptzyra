// Derives SEO fields from article content. Only fills what is empty unless force=true.
const STOP = new Set('the a an and or of to in on for with is are was were be been it this that these those as at by from your you we our can will how what why when which who into about than then them they their there not but have has had do does did more most just also use using used make get gets such per via'.split(' '));
const strip = (s) => String(s || '').replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, ' ').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, ' ').replace(/^[#>*\-\s]+/gm, '').replace(/[*_`~|]/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const cut = (s, n) => { if (s.length <= n) return s; const t = s.slice(0, n - 1); const i = t.lastIndexOf(' '); return (i > n * 0.6 ? t.slice(0, i) : t).replace(/[,;:.\-\s]+$/, '') + '…'; };
export function autoBlogFields(f, force = false) {
  const html = String(f.content || '');
  const text = strip(html);
  const out = {};
  const h1 = (html.match(/^\s*#\s+(.+)$/m) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  const title = (f.title || '').trim() || strip(h1 || '');
  if (title && !f.title?.trim()) out.title = title;
  const set = (k, v) => { if (v && (force || !String(f[k] || '').trim())) out[k] = v; };
  const sentences = text.split(/(?<=[.!?])\s+/).filter((x) => x.length > 30);
  let desc = ''; for (const s of sentences) { if ((desc + ' ' + s).trim().length > 158) break; desc = (desc + ' ' + s).trim(); }
  if (!desc) desc = cut(text, 155);
  set('excerpt', desc);
  set('seo_description', desc);
  set('seo_title', cut(title, 60));
  set('slug', title.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80));
  set('read_time', `${Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200))} min read`);
  set('image_alt', title);
  const img = (html.match(/!\[[^\]]*\]\(([^)\s]+)/) || html.match(/<img[^>]+src=["']([^"']+)/i) || [])[1];
  if (img) set('thumbnail', img);
  const freq = {}; (title + ' ' + title + ' ' + text).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).forEach((w) => { if (w.length > 3 && !STOP.has(w) && !/^\d+$/.test(w)) freq[w] = (freq[w] || 0) + 1; });
  const tags = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w).join(', ');
  set('tags', tags);
  return out;
}
