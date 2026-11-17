'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toLocalInput, fromLocalInput, fmtDate, uploadImage, collectR2Urls, replacedR2Urls, cleanupR2, exportRows } from './common';
import { Loading, ErrorBanner } from './ui';
import { renderMarkdown } from '@/lib/markdown';
import { slugify } from '@/lib/site';
import { autoBlogFields } from '@/lib/blog-auto';
import { BLOG_KINDS } from '@/lib/blog-kinds';

const blank = { title: '', slug: '', category: '', excerpt: '', content: '', tags: '', author: 'Promptzyra Editorial Team', read_time: '5 min read', thumbnail: '', og_image: '', image_alt: '', featured: false, seo_title: '', seo_description: '', faq: '', kind: 'blog', published: false, publish_at: '' };
const IMG = ['thumbnail', 'og_image']; // replaced/removed images in these columns are deleted from R2
const IMG_COLS = ['thumbnail', 'og_image'];
const faqTxt = (a) => (Array.isArray(a) ? a : []).map((x) => `Q: ${x.q}\nA: ${x.a}`).join('\n\n');
const faqArr = (s) => String(s || '').split(/\n\s*\n/).map((b) => { const q = b.match(/^Q:\s*(.*)$/m)?.[1]?.trim(); const a = b.match(/^A:\s*([\s\S]*)$/m)?.[1]?.trim(); return q && a ? { q, a } : null; }).filter(Boolean);

export default function BlogManager({ sb, cats, notify, token, onCatsChange }) {
  const [tagIn, setTagIn] = useState(''); const [newCat, setNewCat] = useState(null);
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [err, setErr] = useState(''); const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null); const [busy, setBusy] = useState(false); const [prev, setPrev] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setErr('');
    const { data, error } = await sb.from('promptzyra_posts').select('*').in('kind', BLOG_KINDS).order('created_at', { ascending: false }).limit(1000);
    if (error) setErr(error.message); else setRows(data || []); setLoading(false);
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  const status = (r) => (!r.published ? 'draft' : r.publish_at && new Date(r.publish_at) > new Date() ? 'scheduled' : 'published');
  const shown = useMemo(() => rows.filter((r) => !q || `${r.title} ${r.slug}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const startNew = () => { setEdit({ id: null, f: { ...blank, category: cats[0]?.name || '' } }); setPrev(false); };
  const startEdit = (r) => { setEdit({ id: r.id, f: { ...blank, ...r, tags: (r.tags || []).join(', '), faq: faqTxt(r.faq), publish_at: toLocalInput(r.publish_at), excerpt: r.excerpt || '', content: r.content || '', seo_title: r.seo_title || '', seo_description: r.seo_description || '' } }); setPrev(false); };
  const set = (k, v) => setEdit((e) => ({ ...e, f: { ...e.f, [k]: v } }));
  const save = async (mode) => {
    let f = edit.f; f = { ...f, ...autoBlogFields(f) }; if (!f.title.trim()) return notify('Title is required', true);
    const published = mode === 'publish' ? true : mode === 'draft' ? false : f.published;
    let pub = fromLocalInput(f.publish_at); if (published && !pub) pub = new Date().toISOString();
    const payload = { title: f.title.trim(), slug: slugify(f.slug || f.title), category: f.category, excerpt: f.excerpt, content: f.content, tags: f.tags.split(',').map((s) => s.trim()).filter(Boolean), keywords: f.tags, author: f.author, read_time: f.read_time, thumbnail: f.thumbnail, og_image: f.og_image || '', image_alt: f.image_alt || '', featured: !!f.featured, seo_title: f.seo_title, seo_description: f.seo_description, faq: faqArr(f.faq), kind: f.kind || 'blog', published, publish_at: published ? pub : fromLocalInput(f.publish_at), updated_at: new Date().toISOString() };
    setBusy(true);
    const run = (pl) => (edit.id ? sb.from('promptzyra_posts').update(pl).eq('id', edit.id) : sb.from('promptzyra_posts').insert(pl));
    const oldRow = edit.id ? rows.find((r) => r.id === edit.id) : null;
    let res = await run(payload);
    if (res.error && /image_alt|featured/.test(res.error.message)) { const { image_alt, featured, ...rest } = payload; res = await run(rest); if (!res.error) notify('Saved — run supabase/v2-patch-2-blog.sql to enable image alt text & featured flag', true); }
    setBusy(false); if (res.error) return notify(/og_image/.test(res.error.message) ? 'The og_image column is missing — run supabase/v2-patch-5-admin.sql in Supabase.' : res.error.message, true);
    const old = oldRow ? replacedR2Urls(oldRow, payload, IMG) : [];
    notify(published ? 'Saved & live (or scheduled)' : 'Draft saved'); setEdit(null); load();
    if (old.length) { const c = await cleanupR2(sb, 'promptzyra_posts', IMG_COLS, old); if (c.msg) notify(c.msg, c.err); }
  };
  const del = async (r) => {
    if (!confirm(`Delete “${r.title}” permanently? Its images will be removed from storage too, unless another post uses them.`)) return;
    const urls = collectR2Urls([r], ['thumbnail', 'og_image', 'content']);
    setBusy(true); const { error } = await sb.from('promptzyra_posts').delete().eq('id', r.id); if (error) { setBusy(false); return notify(error.message, true); }
    load(); const c = await cleanupR2(sb, 'promptzyra_posts', IMG_COLS, urls); setBusy(false);
    notify(`Deleted.${c.msg ? ' ' + c.msg : ''}`, c.err);
  };
  const toggle = async (r) => { const on = status(r) === 'draft'; const { error } = await sb.from('promptzyra_posts').update({ published: on, publish_at: on ? new Date().toISOString() : r.publish_at }).eq('id', r.id); if (error) return notify(error.message, true); load(); };
  const up = async (file) => { if (!file) return; setBusy(true); try { set('thumbnail', await uploadImage(file, token)); notify('Image uploaded'); } catch (e) { notify(e.message, true); } setBusy(false); };
  const tagList = edit ? edit.f.tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const addTag = (t) => { const v = t.trim().replace(/,$/, '').trim(); if (!v || tagList.includes(v)) return; set('tags', [...tagList, v].join(', ')); };
  const rmTag = (t) => set('tags', tagList.filter((x) => x !== t).join(', '));
  const addCat = async () => { const name = (newCat || '').trim(); if (!name) return; const { error } = await sb.from('pz_categories').insert({ kind: 'blog', slug: slugify(name), name, description: '', intro: '', icon: '📝', sort_order: (cats.length + 1) * 10 }); if (error) return notify(error.message, true); set('category', name); setNewCat(null); onCatsChange && (await onCatsChange()); notify('Category added'); };
  const dl = (edit?.f.excerpt || '').length;
  const html = edit && prev ? renderMarkdown(edit.f.content).html : '';
  return (<div>
    <div className="bar"><h1 style={{ margin: 0 }}>Blog articles</h1><span style={{ color: 'var(--mu)' }}>{rows.length} posts</span><div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}><button className="btn" disabled={!rows.length} onClick={() => exportRows(shown, 'promptzyra_posts', 'json')}>Export JSON</button><button className="btn" disabled={!rows.length} onClick={() => exportRows(shown, 'promptzyra_posts', 'csv')}>Export CSV</button><button className="btn pri" onClick={startNew}>+ New article</button></div></div>
    <ErrorBanner error={err} onRetry={load} />
    <div className="ad-card"><input placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
    <div className="ad-card" style={{ padding: 0, overflow: 'auto' }}>{loading ? <Loading what="Loading articles" /> : <table><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>{shown.map((r) => <tr key={r.id}><td><b>{r.title}</b><div style={{ color: 'var(--mu)', fontSize: '.75rem' }}>/blog/{r.slug}</div></td><td>{r.category}</td><td><span className={`pill ${status(r)}`}>{status(r)}</span></td><td>{fmtDate(r.publish_at || r.created_at)}</td><td style={{ whiteSpace: 'nowrap' }}><button className="btn sm" onClick={() => startEdit(r)}>Edit</button> <button className="btn sm" onClick={() => toggle(r)}>{status(r) === 'draft' ? 'Publish' : 'Unpublish'}</button> <a className="btn sm" href={`/blog/${r.slug}`} target="_blank" rel="noreferrer">View</a> <button className="btn sm dng" onClick={() => del(r)}>✕</button></td></tr>)}</tbody></table>}{!loading && !err && !shown.length && <p style={{ padding: 16, color: 'var(--mu)' }}>No articles yet.</p>}</div>
    {edit && <div className="ovl" onMouseDown={(e) => { if (e.target === e.currentTarget && confirm('Close without saving?')) setEdit(null); }}><div className="ed">
      <div className="ed-h"><h2 style={{ margin: 0 }}>{edit.id ? 'Edit article' : 'New article'}</h2><button className="btn sm" onClick={() => setEdit(null)}>Close</button></div>
      <div className="ed-b">
        <div><label>Title</label><input value={edit.f.title} onChange={(e) => { set('title', e.target.value); if (!edit.id) set('slug', slugify(e.target.value)); }} /></div>
        <div className="ad-grid g2"><div><label>URL slug</label><input value={edit.f.slug} onChange={(e) => set('slug', slugify(e.target.value))} /></div><div><label>Category</label>{newCat === null ? <div style={{ display: 'flex', gap: 6 }}><select value={edit.f.category} onChange={(e) => set('category', e.target.value)}>{[...new Set([...cats.map((c) => c.name), edit.f.category].filter(Boolean))].map((c) => <option key={c}>{c}</option>)}</select><button type="button" className="btn sm" onClick={() => setNewCat('')}>+ New</button></div> : <div style={{ display: 'flex', gap: 6 }}><input autoFocus placeholder="New category name" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCat(); } }} /><button type="button" className="btn sm pri" onClick={addCat}>Add</button><button type="button" className="btn sm" onClick={() => setNewCat(null)}>✕</button></div>}</div></div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="button" className="btn sm" onClick={() => { const a = autoBlogFields(edit.f, true); setEdit({ ...edit, f: { ...edit.f, ...a } }); notify('Title, description, tags, slug, read time and image filled from your content'); }}>✨ Auto-fill SEO fields from content</button></div>
        <div><label>Description (shows on blog cards and, by default, in Google)</label><textarea rows={3} value={edit.f.excerpt} onChange={(e) => set('excerpt', e.target.value)} /><div className={`hint cnt${dl >= 140 && dl <= 160 ? ' ok' : ''}`}>{dl} characters — aim for 140–160</div></div>
        <div><div className="bar" style={{ marginBottom: 4 }}><label style={{ margin: 0 }}>Content (Markdown: ## heading, - list, **bold**, [link](https://…), ![alt](image url))</label><button className="btn sm" style={{ marginLeft: 'auto' }} onClick={() => setPrev(!prev)}>{prev ? 'Edit' : 'Preview'}</button></div>
          {prev ? <div className="prev" dangerouslySetInnerHTML={{ __html: html }} /> : <textarea rows={18} className="mono" value={edit.f.content} onChange={(e) => set('content', e.target.value)} />}</div>
        <div><label>Featured image</label><input type="file" accept="image/*" onChange={(e) => up(e.target.files?.[0])} /><input style={{ marginTop: 6 }} placeholder="…or paste an image URL" value={edit.f.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} />{edit.f.thumbnail && <img className="up" src={edit.f.thumbnail} alt="" />}<input style={{ marginTop: 6 }} placeholder="Image alt text (describe the picture — helps SEO & accessibility)" value={edit.f.image_alt} onChange={(e) => set('image_alt', e.target.value)} /><label className="chk" style={{ marginTop: 8 }}><input type="checkbox" checked={!!edit.f.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured post (shown big at top of /blog)</label></div>
        <div className="ad-grid g3"><div><label>Author</label><input value={edit.f.author} onChange={(e) => set('author', e.target.value)} /></div><div><label>Read time</label><input value={edit.f.read_time} onChange={(e) => set('read_time', e.target.value)} /></div><div><label>Tags (Enter or comma to add)</label><div className="tagbox">{tagList.map((t) => <span key={t} className="tagchip">{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => rmTag(t)}>×</button></span>)}<input value={tagIn} placeholder="add tag…" onChange={(e) => { const v = e.target.value; if (v.includes(',')) { addTag(v); setTagIn(''); } else setTagIn(v); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagIn); setTagIn(''); } }} onBlur={() => { addTag(tagIn); setTagIn(''); }} /></div></div></div>
        <div><label>OG image URL (optional, 1200x630) — used when the post is shared</label><input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setBusy(true); try { set('og_image', await uploadImage(f, token)); notify('OG image uploaded'); } catch (er) { notify(er.message, true); } setBusy(false); e.target.value = ''; }} /><input style={{ marginTop: 6 }} placeholder="…or paste an image URL" value={edit.f.og_image || ''} onChange={(e) => set('og_image', e.target.value)} />{edit.f.og_image && <img className="up" src={edit.f.og_image} alt="" />}</div>
        <div className="ad-grid g2"><div><label>SEO title (optional)</label><input value={edit.f.seo_title} onChange={(e) => set('seo_title', e.target.value)} /></div><div><label>Go-live date/time (future = scheduled)</label><input type="datetime-local" value={edit.f.publish_at} onChange={(e) => set('publish_at', e.target.value)} /></div></div>
        <div><label>SEO description (optional, 140–160 chars)</label><textarea rows={2} value={edit.f.seo_description} onChange={(e) => set('seo_description', e.target.value)} /><div className="hint">{(edit.f.seo_description || '').length} characters</div></div>
        <div><label>FAQ (Q: … / A: … — blank line between questions; creates FAQ rich results)</label><textarea rows={5} value={edit.f.faq} onChange={(e) => set('faq', e.target.value)} /></div>
      </div>
      <div className="ed-f"><button className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn" disabled={busy} onClick={() => save('draft')}>Save draft</button><button className="btn pri" disabled={busy} onClick={() => save('publish')}>{busy ? 'Saving…' : 'Publish'}</button></div>
    </div></div>}
  </div>);
}
