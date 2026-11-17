'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { STATUSES, toForm, fromForm, toLocalInput, fromLocalInput, fmtDate, MODEL_OPTS } from './common';
import { slugify } from '@/lib/site';
import { uploadImage, imageKeys, collectR2Urls, replacedR2Urls, cleanupR2, exportRows } from './common';
import { Loading, ErrorBanner } from './ui';

export default function Manager({ sb, table, kind, label, fields, titleKey, path, cats, notify }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); const [err, setErr] = useState('');
  const imgCols = useMemo(() => imageKeys(fields), [fields]);
  const [q, setQ] = useState(''); const [st, setSt] = useState(''); const [cat, setCat] = useState('');
  const [sel, setSel] = useState(new Set());
  const [edit, setEdit] = useState(null); // {id|null, form, status, publish_at}
  const [busy, setBusy] = useState(false);
  const [sch, setSch] = useState({ n: 5, start: new Date(Date.now() + 864e5).toISOString().slice(0, 10) });

  const load = useCallback(async () => {
    setLoading(true); setErr('');
    const { data, error } = await sb.from(table).select('*').order('created_at', { ascending: false }).limit(3000);
    if (error) setErr(error.message); else setRows(data || []); setLoading(false);
  }, [sb, table]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => rows.filter((r) => (!st || r.status === st) && (!cat || r.category === cat) && (!q || `${r[titleKey]} ${r.slug}`.toLowerCase().includes(q.toLowerCase()))), [rows, st, cat, q, titleKey]);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])), [rows]);
  const catName = (s) => cats.find((c) => c.slug === s)?.name || s;

  const startNew = () => setEdit({ id: null, form: toForm({ category: cats[0]?.slug }, fields), status: 'draft', publish_at: '' });
  const startEdit = (r) => setEdit({ id: r.id, form: toForm(r, fields), status: r.status, publish_at: toLocalInput(r.publish_at) });
  const setF = (k, v) => setEdit((e) => ({ ...e, form: { ...e.form, [k]: v } }));

  const save = async (forceStatus) => {
    const f = edit.form; const tv = f[titleKey]?.trim();
    if (!tv) return notify(`${titleKey === 'name' ? 'Name' : 'Title'} is required`, true);
    const payload = fromForm(f, fields); payload.slug = slugify(f.slug || tv);
    let status = forceStatus || edit.status; let pub = fromLocalInput(edit.publish_at);
    if (status === 'published' && !pub) pub = new Date().toISOString();
    if (status === 'scheduled' && !pub) return notify('Choose a publish date for scheduled content', true);
    payload.status = status; payload.publish_at = status === 'draft' || status === 'reviewed' ? pub : pub; payload.updated_at = new Date().toISOString();
    setBusy(true);
    const oldRow = edit.id ? rows.find((r) => r.id === edit.id) : null;
    const res = edit.id ? await sb.from(table).update(payload).eq('id', edit.id) : await sb.from(table).insert(payload);
    setBusy(false);
    if (res.error) return notify(/og_image/.test(res.error.message) ? 'The og_image column is missing — run supabase/v2-patch-5-admin.sql in Supabase.' : res.error.message.includes('duplicate') ? 'This slug already exists — change the slug.' : res.error.message, true);
    const old = oldRow ? replacedR2Urls(oldRow, payload, imgCols) : [];
    notify('Saved'); setEdit(null); load();
    if (old.length) { const c = await cleanupR2(sb, table, imgCols, old); if (c.msg) notify(c.msg, c.err); }
  };
  const bulk = async (patch, ids = [...sel]) => {
    if (!ids.length) return notify('Select some rows first', true);
    setBusy(true); const { error } = await sb.from(table).update({ ...patch, updated_at: new Date().toISOString() }).in('id', ids); setBusy(false);
    if (error) return notify(error.message, true); notify(`${ids.length} updated`); setSel(new Set()); load();
  };
  const del = async (ids) => {
    if (!ids.length || !confirm(`Delete ${ids.length} item(s) permanently? Their images will be removed from storage too, unless another item uses them.`)) return;
    const urls = collectR2Urls(rows.filter((r) => ids.includes(r.id)), imgCols);
    setBusy(true); const { error } = await sb.from(table).delete().in('id', ids); if (error) { setBusy(false); return notify(error.message, true); }
    setSel(new Set()); load();
    const c = await cleanupR2(sb, table, imgCols, urls); setBusy(false);
    notify(`Deleted ${ids.length}.${c.msg ? ' ' + c.msg : ''}`, c.err);
  };
  const publishNext = async () => {
    const n = Math.max(1, +sch.n || 5);
    const pool = rows.filter((r) => r.status === 'reviewed').sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(0, n);
    if (!pool.length) return notify('No "reviewed" items to publish. Mark items as Reviewed first.', true);
    await bulk({ status: 'published', publish_at: new Date().toISOString() }, pool.map((r) => r.id));
  };
  const schedule = async () => {
    const n = Math.max(1, +sch.n || 5);
    const pool = rows.filter((r) => r.status === 'reviewed').sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (!pool.length) return notify('No "reviewed" items to schedule.', true);
    setBusy(true);
    for (let i = 0; i < pool.length; i++) {
      const d = new Date(`${sch.start}T09:00:00`); d.setDate(d.getDate() + Math.floor(i / n)); d.setMinutes(d.getMinutes() + (i % n) * 7);
      const { error } = await sb.from(table).update({ status: 'scheduled', publish_at: d.toISOString(), updated_at: new Date().toISOString() }).eq('id', pool[i].id);
      if (error) { setBusy(false); return notify(error.message, true); }
    }
    setBusy(false); notify(`${pool.length} items scheduled, ${n} per day from ${sch.start}. They go live automatically.`); load();
  };
  const dup = async (r) => { const { id, created_at, updated_at, copy_count, ...rest } = r; const s = `${r.slug}-copy-${Math.random().toString(36).slice(2, 5)}`; const { error } = await sb.from(table).insert({ ...rest, slug: s, status: 'draft', publish_at: null, [titleKey]: `${r[titleKey]} (copy)` }); if (error) return notify(error.message, true); notify('Duplicated as draft'); load(); };
  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (<div>
    <div className="bar"><h1 style={{ margin: 0 }}>{label}</h1><span style={{ color: 'var(--mu)' }}>{rows.length} total · {counts.published} live · {counts.scheduled} scheduled · {counts.reviewed} reviewed · {counts.draft} drafts</span><div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}><button className="btn" disabled={!rows.length} onClick={() => exportRows(shown, table, 'json')}>Export JSON</button><button className="btn" disabled={!rows.length} onClick={() => exportRows(shown, table, 'csv')}>Export CSV</button><button className="btn pri" onClick={startNew}>+ New</button></div></div>
    <ErrorBanner error={err} onRetry={load} />
    <div className="ad-card">
      <div className="bar"><input className="grow" placeholder="Search title or slug…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select style={{ width: 'auto' }} value={st} onChange={(e) => setSt(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select style={{ width: 'auto' }} value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
      <div className="bar"><b>Selected: {sel.size}</b>
        <button className="btn sm" disabled={busy} onClick={() => bulk({ status: 'reviewed' })}>Mark reviewed</button>
        <button className="btn sm" disabled={busy} onClick={() => bulk({ status: 'published', publish_at: new Date().toISOString() })}>Publish now</button>
        <button className="btn sm" disabled={busy} onClick={() => bulk({ status: 'draft', publish_at: null })}>Unpublish → draft</button>
        <button className="btn sm dng" disabled={busy} onClick={() => del([...sel])}>Delete</button></div>
      <div className="bar" style={{ borderTop: '1px solid var(--ln)', paddingTop: 10 }}><b>Daily publishing:</b>
        <input type="number" min="1" style={{ width: 70 }} value={sch.n} onChange={(e) => setSch({ ...sch, n: e.target.value })} /> per day
        <button className="btn sm" disabled={busy} onClick={publishNext}>Publish next {sch.n} reviewed now</button>
        <span style={{ color: 'var(--mu)' }}>or schedule all reviewed from</span><input type="date" style={{ width: 'auto' }} value={sch.start} onChange={(e) => setSch({ ...sch, start: e.target.value })} />
        <button className="btn sm" disabled={busy} onClick={schedule}>Schedule all reviewed</button></div>
    </div>
    <div className="ad-card" style={{ padding: 0, overflow: 'auto' }}>
      {loading ? <Loading what={`Loading ${label.toLowerCase()}`} /> : <table><thead><tr><th><input type="checkbox" aria-label="Select all" checked={shown.length > 0 && shown.every((r) => sel.has(r.id))} onChange={(e) => setSel(e.target.checked ? new Set(shown.map((r) => r.id)) : new Set())} /></th><th>{titleKey === 'name' ? 'Name' : 'Title'}</th><th>Category</th><th>Status</th><th>Go-live</th><th></th></tr></thead>
        <tbody>{shown.slice(0, 300).map((r) => <tr key={r.id}><td><input type="checkbox" checked={sel.has(r.id)} onChange={() => toggle(r.id)} /></td><td><b>{r[titleKey]}</b><div style={{ color: 'var(--mu)', fontSize: '.75rem' }}>/{r.slug}</div></td><td>{catName(r.category)}</td><td><span className={`pill ${r.status}`}>{r.status}</span></td><td>{fmtDate(r.publish_at)}</td>
          <td style={{ whiteSpace: 'nowrap' }}><button className="btn sm" onClick={() => startEdit(r)}>Edit</button> <button className="btn sm" onClick={() => dup(r)}>Duplicate</button> {r.status === 'published' && <a className="btn sm" href={`${path}/${r.slug}`} target="_blank" rel="noreferrer">View</a>} <button className="btn sm dng" onClick={() => del([r.id])}>✕</button></td></tr>)}</tbody></table>}
      {!loading && !err && !shown.length && <p style={{ padding: 16, color: 'var(--mu)' }}>Nothing here yet. Click “New” or use Import to add drafts in bulk.</p>}
      {shown.length > 300 && <p style={{ padding: 12, color: 'var(--mu)' }}>Showing first 300 of {shown.length}. Use search and filters.</p>}
    </div>
    {edit && <div className="ovl" onMouseDown={(e) => { if (e.target === e.currentTarget && confirm('Close without saving?')) setEdit(null); }}><div className="ed">
      <div className="ed-h"><h2 style={{ margin: 0 }}>{edit.id ? 'Edit' : 'New'} {label.toLowerCase().replace(/s$/, '')}</h2><button className="btn sm" onClick={() => setEdit(null)}>Close</button></div>
      <div className="ed-b">
        <div className="ad-grid g2"><div><label>Status</label><select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div><div><label>Go-live date/time <span className="hint">(required for scheduled)</span></label><input type="datetime-local" value={edit.publish_at} onChange={(e) => setEdit({ ...edit, publish_at: e.target.value })} /></div></div>
        {fields.map((fd) => { const v = edit.form[fd.k]; return (<div key={fd.k}>
          {fd.t !== 'bool' && <label>{fd.l}{fd.hint && <span className="hint"> — {fd.hint}</span>}</label>}
          {fd.t === 'text' && <input value={v} onChange={(e) => setF(fd.k, e.target.value)} onBlur={() => { if (fd.k === titleKey && !edit.form.slug && !edit.id) setF('slug', slugify(v)); }} />}
          {fd.t === 'slug' && <input value={v} placeholder="auto from title" onChange={(e) => setF(fd.k, slugify(e.target.value))} />}
          {fd.t === 'image' && <div style={{ display: 'grid', gap: 6 }}><input value={v || ''} placeholder="Image URL (or upload below)" onChange={(e) => setF(fd.k, e.target.value)} /><input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const { data } = await sb.auth.getSession(); const url = await uploadImage(f, data?.session?.access_token); setF(fd.k, url); notify('Image uploaded'); } catch (err) { notify(err.message, true); } e.target.value = ''; }} />{v && <img src={v} alt="" style={{ maxWidth: 220, borderRadius: 8 }} />}</div>}
          {fd.t === 'date' && <input type="date" value={v || ''} onChange={(e) => setF(fd.k, e.target.value)} />}
          {fd.t === 'area' && <textarea rows={fd.rows || 3} className={fd.mono ? 'mono' : ''} value={v} onChange={(e) => setF(fd.k, e.target.value)} />}
          {(fd.t === 'list' || fd.t === 'faq') && <textarea rows={fd.rows || (fd.t === 'faq' ? 6 : 2)} value={v} onChange={(e) => setF(fd.k, e.target.value)} />}
          {fd.t === 'select' && <select value={v} onChange={(e) => setF(fd.k, e.target.value)}>{fd.opts.map((o) => <option key={o}>{o}</option>)}</select>}
          {fd.t === 'cat' && <select value={v} onChange={(e) => setF(fd.k, e.target.value)}>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>}
          {fd.t === 'models' && <div className="chk">{MODEL_OPTS.map((m) => <label key={m.id}><input type="checkbox" checked={v.includes(m.id)} onChange={(e) => setF(fd.k, e.target.checked ? [...v, m.id] : v.filter((x) => x !== m.id))} />{m.label}</label>)}</div>}
          {fd.t === 'bool' && <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--tx)' }}><input type="checkbox" checked={!!v} onChange={(e) => setF(fd.k, e.target.checked)} />{fd.l}</label>}
        </div>); })}
      </div>
      <div className="ed-f"><button className="btn" disabled={busy} onClick={() => setEdit(null)}>Cancel</button><button className="btn" disabled={busy} onClick={() => save('draft')}>Save as draft</button><button className="btn" disabled={busy} onClick={() => save('reviewed')}>Save as reviewed</button><button className="btn pri" disabled={busy} onClick={() => save()}>{busy ? 'Saving…' : `Save (${edit.status})`}</button></div>
    </div></div>}
  </div>);
}
