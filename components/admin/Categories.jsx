'use client';
import { useCallback, useEffect, useState } from 'react';
import { slugify } from '@/lib/site';
import { Loading, ErrorBanner } from './ui';
const KINDS = [['prompt', 'Prompt categories'], ['tool', 'AI tool categories'], ['blog', 'Blog categories'], ['skill', 'Skill categories'], ['photo', 'Photo categories']]; switcher
export default function Categories({ sb, notify, onChange }) {
  const [kind, setKind] = useState('prompt'); const [rows, setRows] = useState([]); const [f, setF] = useState(null); const [loading, setLoading] = useState(true); const [err, setErr] = useState('');
  const load = useCallback(async () => { setLoading(true); setErr(''); const { data, error } = await sb.from('pz_categories').select('*').eq('kind', kind).order('sort_order').order('name'); if (error) setErr(error.message); else setRows(data || []); setLoading(false); }, [sb, kind]);
  useEffect(() => { load(); }, [load]);
  const save = async () => {
    if (!f.name?.trim()) return notify('Name is required', true);
    const p = { kind, slug: slugify(f.slug || f.name), name: f.name.trim(), description: f.description || '', intro: f.intro || '', icon: f.icon || '', sort_order: +f.sort_order || 100 };
    const { error } = f.id ? await sb.from('pz_categories').update(p).eq('id', f.id) : await sb.from('pz_categories').insert(p);
    if (error) return notify(error.message, true); notify('Saved'); setF(null); load(); onChange?.();
  };
  const del = async (r) => {
    const tbl = kind === 'prompt' ? 'pz_prompts' : kind === 'tool' ? 'pz_tools' : kind === 'photo' ? 'pz_photo_prompts' : kind === 'skill' ? 'pz_skills' : null;
    if (tbl) { const { count } = await sb.from(tbl).select('id', { count: 'exact', head: true }).eq('category', r.slug); if (count) return notify(`${count} items still use this category. Move them first.`, true); }
    if (!confirm(`Delete category “${r.name}”?`)) return; const { error } = await sb.from('pz_categories').delete().eq('id', r.id); if (error) return notify(error.message, true); load(); onChange?.();
  };
  return (<div><div className="bar"><h1 style={{ margin: 0 }}>Categories</h1><div style={{ marginLeft: 'auto' }}><button className="btn pri" onClick={() => setF({ name: '', slug: '', description: '', intro: '', icon: '✨', sort_order: (rows.length + 1) * 10 })}>+ New category</button></div></div>
    <div className="bar">{KINDS.map(([k, l]) => <button key={k} className={`btn ${kind === k ? 'pri' : ''}`} onClick={() => setKind(k)}>{l}</button>)}</div>
    <ErrorBanner error={err} onRetry={load} />
    <div className="ad-card" style={{ padding: 0, overflow: 'auto' }}>{loading ? <Loading what="Loading categories" /> : <table><thead><tr><th>Icon</th><th>Name</th><th>Slug</th><th>Order</th><th></th></tr></thead><tbody>{rows.map((r) => <tr key={r.id}><td>{r.icon}</td><td><b>{r.name}</b><div style={{ color: 'var(--mu)', fontSize: '.75rem' }}>{r.description}</div></td><td>{r.slug}</td><td>{r.sort_order}</td><td style={{ whiteSpace: 'nowrap' }}><button className="btn sm" onClick={() => setF(r)}>Edit</button> <button className="btn sm dng" onClick={() => del(r)}>✕</button></td></tr>)}</tbody></table>}{!loading && !err && !rows.length && <p style={{ padding: 16, color: 'var(--mu)' }}>No categories yet — run supabase/v2-setup.sql to seed defaults or add one.</p>}</div>
    {f && <div className="ovl" onMouseDown={(e) => { if (e.target === e.currentTarget) setF(null); }}><div className="ed"><div className="ed-h"><h2 style={{ margin: 0 }}>{f.id ? 'Edit' : 'New'} category</h2><button className="btn sm" onClick={() => setF(null)}>Close</button></div><div className="ed-b">
      <div className="ad-grid g2"><div><label>Name</label><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value, slug: f.id ? f.slug : slugify(e.target.value) })} /></div><div><label>Slug {f.id && <span className="hint">(changing it breaks existing links and item assignments)</span>}</label><input value={f.slug} onChange={(e) => setF({ ...f, slug: slugify(e.target.value) })} /></div></div>
      <div className="ad-grid g2"><div><label>Icon (emoji)</label><input value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} /></div><div><label>Sort order</label><input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} /></div></div>
      <div><label>Short description (meta description for the category page)</label><textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      <div><label>Intro paragraph (shown at the top of the category page — unique text helps SEO)</label><textarea rows={4} value={f.intro} onChange={(e) => setF({ ...f, intro: e.target.value })} /></div>
    </div><div className="ed-f"><button className="btn" onClick={() => setF(null)}>Cancel</button><button className="btn pri" onClick={save}>Save</button></div></div></div>}
  </div>);
}
