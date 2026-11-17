'use client';
import { useState } from 'react';
import { Download, Check, ExternalLink } from 'lucide-react';
import SkillCopy from './SkillCopy';
import { makeZip, downloadBlob } from '@/lib/zip';
import { getSupabase } from '@/lib/supabase';

const bump = (slug) => { try { getSupabase()?.rpc('pz_bump_component_copy', { p_slug: slug }).then(() => {}, () => {}); } catch (e) {} };

// files: [{path,text}]; install: plain-English steps (one per line)
export default function CompInstall({ slug, folder, files, install, github }) {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const all = () => files.map((f) => `// ${f.path}\n${f.text}`).join('\n\n');
  const download = () => {
    try { downloadBlob(`${folder}.zip`, makeZip(files.map((f) => ({ name: `${folder}/${f.path}`, data: f.text }))), 'application/zip'); setDone(true); setErr(''); setTimeout(() => setDone(false), 2500); bump(slug); }
    catch (e) { setErr('Could not build the zip in this browser. Use Copy instead.'); }
  };
  const steps = String(install || '').split('\n').map((s) => s.trim().replace(/^(\d+[.)]|[-*•])\s+/, '')).filter(Boolean);
  return (
    <section className="panel sk-install" aria-labelledby="ci-h">
      <h2 id="ci-h" className="sk-h2">Get it</h2>
      <div className="sk-methods">
        {files.length > 0 && <div className="sk-method"><b>Download .zip</b>
          <button type="button" className="btn btn-primary" onClick={download}>{done ? <Check size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}{done ? 'Downloaded' : `Download ${folder}.zip`}</button>
          <small className="muted">Built in your browser, nothing is uploaded.</small>{err && <small role="alert" style={{ color: 'var(--warn)' }}>{err}</small>}</div>}
        {files.length > 0 && <div className="sk-method"><b>Copy {files.length === 1 ? files[0].path : 'all files'}</b><SkillCopy text={files.length === 1 ? files[0].text : all} label="Copy" small={false} /></div>}
        {github && <div className="sk-method"><b>Source on GitHub</b><a className="btn" href={github} target="_blank" rel="noopener noreferrer nofollow"><ExternalLink size={16} aria-hidden="true" />Open source page</a></div>}
      </div>
      {steps.length > 0 && <div className="sk-howto"><h3>How to use</h3><ol>{steps.map((s, i) => <li key={i}>{s}</li>)}</ol><p className="muted small" style={{ margin: 0 }}>Tool menus and file locations change over time, so check the official docs linked above if a step looks different.</p></div>}
    </section>
  );
}
