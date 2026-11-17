'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fmtDate, exportRows } from './common';
import { Loading, ErrorBanner } from './ui';

export default function Subscribers({ sb, notify }) {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [err, setErr] = useState(''); const [q, setQ] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setErr('');
    const { data, error } = await sb.from('pz_subscribers').select('*').order('created_at', { ascending: false }).limit(5000);
    if (error) setErr(error.message); else setRows(data || []); setLoading(false);
  }, [sb]);
  useEffect(() => { load(); }, [load]);
  const shown = useMemo(() => rows.filter((r) => !q || `${r.email} ${r.source || ''}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const del = async (r) => { if (!confirm(`Remove ${r.email}?`)) return; const { error } = await sb.from('pz_subscribers').delete().eq('id', r.id); if (error) return notify(error.message, true); notify('Removed'); load(); };
  const csv = () => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const body = ['email,source,subscribed_at', ...shown.map((r) => [r.email, r.source, r.created_at].map(esc).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = 'promptzyra-subscribers.csv'; a.click(); URL.revokeObjectURL(url);
  };
  return (<div>
    <div className="bar"><h1 style={{ margin: 0 }}>Newsletter subscribers</h1><span style={{ color: 'var(--mu)' }}>{rows.length} total</span><div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}><button className="btn" onClick={() => exportRows(shown, 'promptzyra-subscribers', 'json')} disabled={!shown.length}>Export JSON</button><button className="btn pri" onClick={csv} disabled={!shown.length}>Export CSV</button></div></div>
    <ErrorBanner error={err} onRetry={load} />
    <div className="ad-card"><input placeholder="Search email or source…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
    <div className="ad-card" style={{ padding: 0, overflow: 'auto' }}>{loading ? <Loading what="Loading subscribers" /> : <table><thead><tr><th>Email</th><th>Source</th><th>Date</th><th></th></tr></thead><tbody>{shown.map((r) => <tr key={r.id}><td>{r.email}</td><td>{r.source}</td><td>{fmtDate(r.created_at)}</td><td><button className="btn sm dng" onClick={() => del(r)}>✕</button></td></tr>)}</tbody></table>}{!loading && !err && !shown.length && <p style={{ padding: 16, color: 'var(--mu)' }}>No subscribers yet.</p>}</div>
  </div>);
}
