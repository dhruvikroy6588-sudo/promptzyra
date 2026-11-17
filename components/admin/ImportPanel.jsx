'use client';
import { useState } from 'react';
import { slugify } from '@/lib/site';
import { PROMPT_FIELDS, TOOL_FIELDS, PHOTO_FIELDS } from './common';
function parseCsv(t) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) { const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (c !== '\r') cur += c; }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [h, ...b] = rows.filter((r) => r.some((x) => x.trim())); if (!h) return [];
  return b.map((r) => Object.fromEntries(h.map((k, i) => [k.trim(), (r[i] || '').trim()])));
}
const LISTS = { blog: ['tags'], photo: ['tips', 'tags'], prompt: ['tips', 'tags', 'models', 'related_tools'], tool: ['platforms', 'use_steps', 'pros', 'cons', 'alternatives', 'tags'] };
export default function ImportPanel({ sb, notify }) {
  const [kind, setKind] = useState('prompt'); const [text, setText] = useState(''); const [prev, setPrev] = useState(null); const [busy, setBusy] = useState(false);
  const table = kind === 'prompt' ? 'pz_prompts' : kind === 'photo' ? 'pz_photo_prompts' : kind === 'blog' ? 'promptzyra_posts' : 'pz_tools'; const tk = kind === 'tool' ? 'name' : 'title';
  const normalize = (o) => {
    const r = { ...o }; for (const k of LISTS[kind]) if (typeof r[k] === 'string') r[k] = r[k].split('|').map((s) => s.trim()).filter(Boolean);
    if (typeof r.faq === 'string') { try { r.faq = JSON.parse(r.faq); } catch { r.faq = []; } }
    r.slug = slugify(r.slug || r[tk] || ''); if (kind === 'blog') { const live = r.go_live === true; delete r.go_live; delete r.image_kw; r.published = live; r.kind = r.kind || 'blog'; r.publish_at = live ? new Date().toISOString() : null; r.thumbnail = r.thumbnail || ''; } else { r.status = 'draft'; r.publish_at = null; } delete r.id; delete r.copy_count;
    return r;
  };
  const parse = async () => {
    try {
      const t = text.trim(); let arr = t.startsWith('[') ? JSON.parse(t) : parseCsv(t);
      arr = arr.map(normalize).filter((r) => r[tk] && r.slug && r.category);
      const { data, error: se } = await sb.from(table).select('slug').limit(5000); if (se) return notify('Could not check existing slugs: ' + se.message, true); const have = new Set((data || []).map((x) => x.slug));
      const seen = new Set(); const ok = [], dup = [];
      for (const r of arr) { if (have.has(r.slug) || seen.has(r.slug)) dup.push(r); else { seen.add(r.slug); ok.push(r); } }
      setPrev({ ok, dup });
    } catch (e) { notify('Could not read this data: ' + e.message, true); }
  };
  const run = async () => {
    setBusy(true);
    for (let i = 0; i < prev.ok.length; i += 40) { const { error } = await sb.from(table).insert(prev.ok.slice(i, i + 40)); if (error) { setBusy(false); return notify(`Stopped at row ${i + 1}: ${error.message}`, true); } }
    setBusy(false); notify(`${prev.ok.length} drafts imported`); setPrev(null); setText('');
  };
  const template = () => { const f = (kind === 'prompt' ? PROMPT_FIELDS : kind === 'photo' ? PHOTO_FIELDS : kind === 'blog' ? [{k:'title'},{k:'slug'},{k:'category'},{k:'excerpt'},{k:'content'},{k:'tags'},{k:'author'},{k:'read_time'}] : TOOL_FIELDS).filter((x) => !['bool'].includes(x.t)).map((x) => x.k); const b = new Blob([f.join(',') + '\n'], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${kind}-import-template.csv`; a.click(); };
  return (<div><h1>Import drafts</h1><p style={{ color: 'var(--mu)', maxWidth: 760 }}>Paste a JSON array or CSV. Every row is saved as a <b>draft</b> — nothing goes live until you review it. Existing slugs are skipped. In CSV, separate list values with <code>|</code>. Required columns: <code>{tk}</code> and <code>category</code> (category slug).</p>
    <div className="bar"><button className={`btn ${kind === 'prompt' ? 'pri' : ''}`} onClick={() => { setKind('prompt'); setPrev(null); }}>Prompts</button><button className={`btn ${kind === 'tool' ? 'pri' : ''}`} onClick={() => { setKind('tool'); setPrev(null); }}>AI tools</button><button className={`btn ${kind === 'photo' ? 'pri' : ''}`} onClick={() => { setKind('photo'); setPrev(null); }}>Photo prompts</button><button className={`btn ${kind === 'blog' ? 'pri' : ''}`} onClick={() => { setKind('blog'); setPrev(null); }}>Blog</button><button className="btn" onClick={template}>Download CSV header</button>
      <label className="btn" style={{ margin: 0 }}>Load file…<input hidden type="file" accept=".json,.csv,.txt" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setText(await f.text()); e.target.value = ''; }} /></label></div>
    <textarea rows={14} className="mono" value={text} onChange={(e) => { setText(e.target.value); setPrev(null); }} placeholder="Paste JSON array or CSV here…" />
    <div className="bar" style={{ marginTop: 10 }}><button className="btn" disabled={!text.trim()} onClick={parse}>Check data</button>{prev && <><span>{prev.ok.length} new · {prev.dup.length} duplicates skipped</span><button className="btn pri" disabled={busy || !prev.ok.length} onClick={run}>{busy ? 'Importing…' : `Import ${prev.ok.length} as drafts`}</button></>}</div>
    {prev?.dup.length > 0 && <p style={{ color: 'var(--wn)' }}>Skipped: {prev.dup.slice(0, 12).map((r) => r.slug).join(', ')}{prev.dup.length > 12 ? '…' : ''}</p>}</div>);
}
