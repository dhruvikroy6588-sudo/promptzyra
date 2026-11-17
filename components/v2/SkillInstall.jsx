'use client';
import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import SkillCopy, { bumpSkill } from './SkillCopy';
import { makeZip, downloadBlob } from '@/lib/zip';

// files: [{ path, text }] ; folder: skill slug used as the zip folder name
export default function SkillInstall({ slug, folder, files }) {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const main = files.find((f) => f.path === 'SKILL.md')?.text || '';
  const download = () => {
    try {
      const zip = makeZip(files.map((f) => ({ name: `${folder}/${f.path}`, data: f.text })));
      downloadBlob(`${folder}.zip`, zip, 'application/zip');
      setDone(true); setErr(''); setTimeout(() => setDone(false), 2500); bumpSkill(slug);
    } catch (e) { setErr('Could not build the zip in this browser. Use Copy SKILL.md instead.'); }
  };
  return (
    <section className="panel sk-install" aria-labelledby="sk-install-h">
      <h2 id="sk-install-h" className="sk-h2">Install</h2>
      <div className="sk-methods">
        <div className="sk-method">
          <b>Download .zip</b>
          <button type="button" className="btn btn-primary" onClick={download}>{done ? <Check size={16} aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}{done ? 'Downloaded' : `Download ${folder}.zip`}</button>
          <small className="muted">Contains <code>{folder}/SKILL.md</code>{files.length > 1 ? <> and <code>{folder}/references/guide.md</code></> : null}. Built in your browser, nothing is uploaded.</small>
          {err && <small role="alert" style={{ color: 'var(--warn)' }}>{err}</small>}
        </div>
        <div className="sk-method">
          <b>Copy SKILL.md</b>
          <SkillCopy text={main} slug={slug} bump small={false} label="Copy SKILL.md" />
        </div>
      </div>
      <div className="sk-howto">
        <h3>How to install</h3>
        <ul>
          <li><b>Claude Code:</b> put the folder in <code>~/.claude/skills/{folder}/</code> for all projects, or in <code>.claude/skills/{folder}/</code> inside one project.</li>
          <li><b>Claude.ai:</b> open Settings, go to Capabilities (or Skills) and upload the zip where your Claude plan allows custom skills.</li>
          <li><b>Other chat tools:</b> paste the contents of SKILL.md as the instructions (custom instructions, project instructions or the first message).</li>
        </ul>
        <p className="muted small" style={{ margin: 0 }}>Menu names change over time, so check your tool's help if a step looks different.</p>
      </div>
    </section>
  );
}
