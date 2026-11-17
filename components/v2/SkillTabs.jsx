'use client';
import { useEffect, useMemo, useState } from 'react';
import { FileText, FolderClosed } from 'lucide-react';
import SkillMarkdown from './SkillMarkdown';
import SkillCopy from './SkillCopy';
import { headingsOf, kbLabel } from '@/lib/skill-md';

// files: [{ path, text, lines, bytes }]; overview: server-rendered node for the Overview tab
export default function SkillTabs({ slug, files, overview }) {
  const [tab, setTab] = useState('overview');
  const [sel, setSel] = useState(0);
  const [mode, setMode] = useState('code');
  useEffect(() => { try { if (location.hash === '#files') setTab('files'); } catch (e) {} }, []);
  const file = files[Math.min(sel, files.length - 1)] || files[0];
  const heads = useMemo(() => headingsOf(file?.text || '', `sk${sel}-`), [file, sel]);
  const jump = (id) => { setMode('preview'); setTimeout(() => { try { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }, 60); };
  const lines = useMemo(() => String(file?.text || '').replace(/\n$/, '').split('\n'), [file]);
  return (
    <div className="sk-tabs">
      <div className="sk-tablist" role="tablist" aria-label="Skill sections">
        <button type="button" role="tab" id="sk-t-overview" aria-selected={tab === 'overview'} aria-controls="sk-p-overview" className={tab === 'overview' ? 'on' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button type="button" role="tab" id="sk-t-files" aria-selected={tab === 'files'} aria-controls="sk-p-files" className={tab === 'files' ? 'on' : ''} onClick={() => setTab('files')}>Files <span className="sk-n">{files.length}</span></button>
      </div>
      <div role="tabpanel" id="sk-p-overview" aria-labelledby="sk-t-overview" hidden={tab !== 'overview'}>{overview}</div>
      <div role="tabpanel" id="sk-p-files" aria-labelledby="sk-t-files" hidden={tab !== 'files'}>
        <div className="sk-filetable" role="table" aria-label="Files in this skill">
          <div className="sk-ft-head" role="row"><span role="columnheader">Name</span><span role="columnheader">Lines</span><span role="columnheader">Size</span></div>
          {files.some((f) => f.path.includes('/')) && <div className="sk-ft-row sk-ft-dir" role="row"><span><FolderClosed size={15} aria-hidden="true" /> references/</span><span /><span /></div>}
          {files.map((f, i) => (
            <button type="button" key={f.path} role="row" className={`sk-ft-row${i === sel ? ' on' : ''}`} aria-pressed={i === sel} onClick={() => { setSel(i); setMode('code'); }}>
              <span><FileText size={15} aria-hidden="true" /> {f.path}</span><span>{f.lines}</span><span>{kbLabel(f.bytes)}</span>
            </button>
          ))}
        </div>
        <div className="sk-viewwrap">
          <div className="sk-viewer">
            <div className="sk-vbar">
              <span className="sk-vname"><FileText size={15} aria-hidden="true" /> {file?.path}<small>{file?.lines} lines · {kbLabel(file?.bytes || 0)}</small></span>
              <span className="sk-vact">
                <span className="sk-toggle" role="group" aria-label="View mode">
                  <button type="button" className={mode === 'code' ? 'on' : ''} aria-pressed={mode === 'code'} onClick={() => setMode('code')}>Code</button>
                  <button type="button" className={mode === 'preview' ? 'on' : ''} aria-pressed={mode === 'preview'} onClick={() => setMode('preview')}>Preview</button>
                </span>
                <SkillCopy text={file?.text || ''} slug={slug} bump label="Copy" />
              </span>
            </div>
            {mode === 'code'
              ? <div className="sk-codewrap" tabIndex={0} aria-label={`${file?.path} source`}><pre className="sk-gutter" aria-hidden="true">{lines.map((_, i) => i + 1).join('\n')}</pre><pre className="sk-code"><code>{lines.join('\n')}</code></pre></div>
              : <div className="sk-preview"><SkillMarkdown md={file?.text || ''} idPrefix={`sk${sel}-`} /></div>}
          </div>
          {heads.length > 0 && <nav className="sk-outline" aria-label="On this page"><h3>On this page</h3><ul>{heads.map((h) => <li key={h.id} style={{ paddingLeft: (h.level - 1) * 10 }}><a href={`#${h.id}`} onClick={(e) => { e.preventDefault(); jump(h.id); }}>{h.text}</a></li>)}</ul></nav>}
        </div>
      </div>
    </div>
  );
}
