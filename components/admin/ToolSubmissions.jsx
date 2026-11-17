'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fmtDate, exportRows } from './common';
import { slugify } from '@/lib/site';
import { Loading, ErrorBanner } from './ui';

export default function ToolSubmissions({ sb, notify, cats = [] }) {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [err, setErr] = useState('');
  const [q, setQ] = useState(''); const [st, setSt] = useState(''); const [busy, setBusy] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setErr('');
    const { data, error } = await sb.from('pz_tool_submissions').select('*').order('created_at', { ascending: false }).limit(3000);
    if (error) setErr(/does not exist|schema cache/i.test(error.message) ? 'The submissions table is missing — run supabase/v2-patch-7-tools.sql in Supabase.' : error.message); else setRows(data || []);
    setLoading(false);
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  const shown = useMemo(() => rows.filter((r) => (!st || r.status === st) && (!q || `${r.name} ${r.website_url} ${r.contact_email} ${r.description}`.toLowerCase().includes(q.toLowerCase()))), [rows, q, st]);
  const newCount = rows.filter((r) => r.status === 'new').length;
  const catName = (s) => cats.find((c) => c.slug === s)?.name || s || '—';

  const setStatus = async (r, status) => { setBusy(r.id); const { error } = await sb.from('pz_tool_submissions').update({ status }).eq('id', r.id); setBusy(''); if (error) return notify(error.message, true); notify('Updated'); load(); };
  const del = async (r) => { if (!confirm(`Delete the submission "${r.name}"?`)) return; setBusy(r.id); const { error } = await sb.from('pz_tool_submissions').delete().eq('id', r.id); setBusy(''); if (error) return notify(error.message, true); notify('Deleted'); load(); };
  const draft = async (r) => {
    setBusy(r.id);
    const base = slugify(r.name) || 'tool';
    const row = { name: r.name, website_url: r.website_url, category: r.category || 'productivity', description: r.description || '', pricing: 'Freemium', status: 'draft' };
    let { error } = await sb.from('pz_tools').insert({ ...row, slug: base });
    if (error && String(error.code) === '23505') ({ error } = await sb.from('pz_tools').insert({ ...row, slug: `${base}-${Math.random().toString(36).slice(2, 6)}` }));
    if (error) { setBusy(''); return notify(error.message, true); }
    const u = await sb.from('pz_tool_submissions').update({ status: 'drafted' }).eq('id', r.id);
    setBusy(''); notify(u.error ? `Draft created, but the status could not be updated: ${u.error.message}` : 'Draft tool created — find it under AI Tools', !!u.error); load();
  };
  return (<div>
    <div className="bar"><h1 style={{ margin: 0 }}>Tool submissions</h1><span style={{ color: 'var(--mu)' }}>{rows.length} total · {newCount} new</span><div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}><button className="btn" disabled={!shown.length} onClick={() => exportRows(shown, 'tool-submissions', 'csv')}>Export CSV</button></div></div>
    <ErrorBanner error={err} onRetry={load} />
    <div className="ad-card"><div className="bar" style={{ marginBottom: 0 }}><input className="grow" placeholder="Search name, website, email or description…" value={q} onChange={(e) => setQ(e.target.value)} /><select style={{ width: 'auto' }} value={st} onChange={(e) => setSt(e.target.value)}><option value="">All statuses</option><option value="new">new</option><option value="reviewed">reviewed</option><option value="drafted">drafted</option></select></div></div>
    <div className="ad-card" style={{ padding: 0, overflow: 'auto' }}>
      {loading ? <Loading what="Loading submissions" /> : <table><thead><tr><th>Tool</th><th>Category</th><th>Description</th><th>Contact</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>{shown.map((r) => <tr key={r.id}>
          <td><b>{r.name}</b><div style={{ fontSize: '.75rem' }}>{/^https?:\/\//i.test(r.website_url) ? <a href={r.website_url} target="_blank" rel="noreferrer nofollow">{r.website_url}</a> : r.website_url}</div></td>
          <td>{catName(r.category)}</td><td><div className="sub-desc">{r.description || '—'}</div></td><td>{r.contact_email || '—'}</td>
          <td><span className={`pill ${r.status}`}>{r.status}</span></td><td>{fmtDate(r.created_at)}</td>
          <td style={{ whiteSpace: 'nowrap' }}>{r.status !== 'drafted' && <button className="btn sm" disabled={busy === r.id} onClick={() => draft(r)}>Create draft tool</button>} {r.status === 'new' && <button className="btn sm" disabled={busy === r.id} onClick={() => setStatus(r, 'reviewed')}>Mark reviewed</button>} <button className="btn sm dng" disabled={busy === r.id} onClick={() => del(r)}>Delete</button></td>
        </tr>)}</tbody></table>}
      {!loading && !err && !shown.length && <p style={{ padding: 16, color: 'var(--mu)' }}>{rows.length ? 'No submissions match.' : 'No submissions yet. Visitors can send tools from /ai-tools/submit.'}</p>}
    </div>
  </div>);
}
