'use client';
import { useMemo, useState } from 'react';
import CopyButton from './CopyButton';
const re = /\{\{\s*([A-Za-z][^}\n]{1,40}?)\s*\}\}/g;
export default function PromptCustomizer({ prompt, slug, extra }) {
  const vars = useMemo(() => [...new Set([...prompt.matchAll(re)].map((m) => m[1]))], [prompt]);
  const [v, setV] = useState({});
  const out = () => prompt.replace(re, (m, k) => (v[k] && v[k].trim()) || `[${k}]`);
  const parts = out().split(/(\[[A-Za-z][^\]\n]{1,40}\])/g);
  return (
    <div>
      {vars.length > 0 && <div className="panel" style={{ marginBottom: 14 }}><h3>Fill in the blanks</h3><p className="muted small">Optional — replace the blanks and copy a ready-to-paste prompt.</p><div className="grid g2">{vars.map((k) => <div key={k}><label>{k}</label><input value={v[k] || ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} placeholder={k} /></div>)}</div></div>}
      <div className="pre" tabIndex={0} aria-label="Prompt text">{parts.map((s, i) => /^\[.+\]$/.test(s) ? <span className="var" key={i}>{s}</span> : s)}</div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}><CopyButton text={out} slug={slug} />{extra}</div>
    </div>
  );
}
