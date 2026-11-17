'use client';
import { useEffect, useRef } from 'react';
import '@fontsource-variable/inter';
import '@fontsource-variable/work-sans';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/lora';
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/700.css';
import './resume.css';
import { FONT_PAIRS, PALETTES } from '@/lib/resume/templates';
import { SIDE_TYPES, SECTION_TYPES, tags } from '@/lib/resume/model';

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function Ed({ v = '', on, ph, as: Tag = 'span', className = '' }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (el && document.activeElement !== el && el.innerText !== v) el.innerText = v; }, [v]);
  if (!on) return v ? <Tag className={className}>{v}</Tag> : null;
  return <Tag ref={ref} className={`ed ${className}`} contentEditable suppressContentEditableWarning data-ph={ph} spellCheck={false}
    onBlur={(e) => { const t = e.currentTarget.innerText.replace(/\n+/g, ' ').trim(); if (t !== v) on(t); }}
    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} />;
}
function Para({ v = '', on, ph }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (el && document.activeElement !== el && el.innerText !== v) el.innerText = v; }, [v]);
  if (!on) return v ? <p className="rs-txt">{v}</p> : null;
  return <p ref={ref} className="rs-txt ed" contentEditable suppressContentEditableWarning data-ph={ph} spellCheck={false}
    onBlur={(e) => { const t = e.currentTarget.innerText.trim(); if (t !== v) on(t); }} />;
}
function Bullets({ v = '', on, ph }) {
  const ref = useRef(null);
  const lines = v.split('\n').map((s) => s.trim()).filter(Boolean);
  useEffect(() => { const el = ref.current; if (!el || document.activeElement === el || el.contains(document.activeElement)) return; el.innerHTML = lines.map((l) => `<li>${esc(l)}</li>`).join(''); }, [v]);
  if (!on) return lines.length ? <ul className="rs-ul">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul> : null;
  return <ul ref={ref} className="rs-ul ed" contentEditable suppressContentEditableWarning data-ph={ph} spellCheck={false}
    onBlur={(e) => { const t = [...e.currentTarget.querySelectorAll('li')].map((li) => li.innerText.trim()).filter(Boolean); if (!t.length && e.currentTarget.innerText.trim()) t.push(e.currentTarget.innerText.trim()); const nv = t.join('\n'); if (nv !== v) on(nv); }} />;
}

export default function ResumeView({ data, tpl, settings = {}, edit, onChange, onOpenSection }) {
  const font = FONT_PAIRS[tpl.font] || FONT_PAIRS.inter;
  const pal = PALETTES[tpl.palette] || PALETTES[0];
  const accent = settings.accent || pal.accent;
  const dark = settings.accent ? settings.accent : pal.dark;
  const sc = settings.scale || 1;
  const style = { '--hf': font.head, '--bf': font.body, '--acc': accent, '--dark': dark, '--fs': `${(tpl.size || 13) * sc}px` };
  const sidebar = tpl.layout === 'side-l' || tpl.layout === 'side-r';
  const twoCol = tpl.layout === 'two';
  const cls = ['rs-page', settings.paper === 'letter' ? 'letter' : '', `rs-L-${tpl.layout}`, `rs-H-${tpl.header}`, `rs-hd-${tpl.heading}`, `rs-bu-${tpl.bullet}`, `rs-dt-${tpl.date}`, `rs-sk-${tpl.skill}`, `rs-tone-${sidebar ? tpl.tone : "none"}`, settings.density === 'dense' ? 'rs-dense' : settings.density === 'loose' ? 'rs-loose' : ''].filter(Boolean).join(' ');
  const p = data.personal;
  const setP = (k) => edit && ((v) => onChange({ ...data, personal: { ...p, [k]: v } }));
  const patchSec = (id, patch) => onChange({ ...data, sections: data.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const patchItem = (sid, iid, patch) => onChange({ ...data, sections: data.sections.map((s) => (s.id === sid ? { ...s, items: s.items.map((it) => (it.id === iid ? { ...it, ...patch } : it)) } : s)) });

  const contact = [['email', p.email], ['phone', p.phone], ['location', p.location], ['website', p.website], ['linkedin', p.linkedin]];
  const Contact = () => <div className="rs-contact">{contact.map(([k, v]) => (v || edit) ? <span key={k}><Ed v={v} on={setP(k)} ph={k} /></span> : null)}</div>;
  const nameParts = (p.name || '').trim().split(/\s+/);
  const Name = () => tpl.header === 'stack' && !edit
    ? <h1 className="rs-name">{nameParts.length > 1 ? <><span>{nameParts[0]}</span><span>{nameParts.slice(1).join(' ')}</span></> : <span>{p.name}</span>}</h1>
    : <h1 className="rs-name"><Ed v={p.name} on={setP('name')} ph="Your name" /></h1>;
  const Header = ({ withContact = true }) => (
    <header className={`rs-hdr${sidebar ? ' rs-in-main' : ''}`}>
      <div className="rs-hn"><Name /><p className="rs-role"><Ed v={p.title} on={setP('title')} ph="Job title" /></p></div>
      {withContact && <Contact />}
    </header>
  );

  const Section = ({ s, full }) => {
    const T = SECTION_TYPES[s.type]; if (!s.visible) return null;
    const head = <h2 className="rs-h"><Ed v={s.title} on={edit && ((v) => patchSec(s.id, { title: v }))} ph="Section title" /></h2>;
    let body = null;
    if (T.kind === 'text') body = <Para v={s.text} on={edit && ((v) => patchSec(s.id, { text: v }))} ph="Write a short summary…" />;
    else if (T.kind === 'tags') { const arr = tags(s.text); body = (arr.length || edit) ? <div className="rs-tags" onClick={edit ? () => onOpenSection?.(s.id) : undefined} title={edit ? 'Click to edit in the left panel' : undefined}>{arr.length ? arr.map((t, i) => <span className="rs-tag" key={i}>{t}</span>) : <span className="rs-mut" style={{ opacity: .5 }}>Click to add…</span>}</div> : null; }
    else body = s.items.map((it) => {
      const sub = [it.subtitle, it.location].filter(Boolean).join(' · ');
      const date = [it.start, it.end].filter(Boolean).join(' – ');
      return (
        <div className="rs-entry" key={it.id}>
          <div className="rs-eh">
            <div className="rs-et"><b><Ed v={it.title} on={edit && ((v) => patchItem(s.id, it.id, { title: v }))} ph={T.f?.[0]} /></b>{edit ? <span className="rs-es"><Ed v={it.subtitle} on={(v) => patchItem(s.id, it.id, { subtitle: v })} ph={T.f?.[1]} /></span> : sub ? <span className="rs-es">{sub}</span> : null}</div>
            {edit ? <div className="rs-ed"><Ed v={it.start} on={(v) => patchItem(s.id, it.id, { start: v })} ph="Start" /> – <Ed v={it.end} on={(v) => patchItem(s.id, it.id, { end: v })} ph="End" /></div> : date ? <div className="rs-ed">{date}</div> : null}
          </div>
          <div className="rs-bwrap"><Bullets v={it.text} on={edit && ((v) => patchItem(s.id, it.id, { text: v }))} ph="Add achievements, one per line" /></div>
        </div>
      );
    });
    return <section className={`rs-sec${full ? ' rs-full' : ''}`}>{head}{body}</section>;
  };

  let secs = data.sections.filter((s) => s.visible);
  if (tpl.eduFirst) { const e = secs.filter((s) => s.type === 'education'); secs = [...e, ...secs.filter((s) => s.type !== 'education')]; }
  const isSide = (s) => (sidebar && SIDE_TYPES.includes(s.type)) || (twoCol && ['skills', 'languages', 'certifications', 'interests', 'awards'].includes(s.type));
  const main = secs.filter((s) => !isSide(s)), side = secs.filter(isSide);

  return (
    <div className={cls} style={style}>
      {sidebar ? (
        <div className="rs-cols">
          <aside className="rs-side"><div className="rs-contact-wrap"><Contact /></div>{side.map((s) => <Section key={s.id} s={s} />)}</aside>
          <div className="rs-main">{<Header withContact={false} />}{main.map((s) => <Section key={s.id} s={s} />)}</div>
        </div>
      ) : (
        <div className="rs-pad">
          <Header />
          {tpl.layout === 'two' ? <div className="rs-cols"><div className="rs-main">{main.map((s) => <Section key={s.id} s={s} />)}</div><aside className="rs-side">{side.map((s) => <Section key={s.id} s={s} />)}</aside></div>
            : tpl.layout === 'grid2' ? <div className="rs-cols">{secs.map((s) => <Section key={s.id} s={s} full={s.type === 'summary'} />)}</div>
            : <div className="rs-cols"><div className="rs-main">{secs.map((s) => <Section key={s.id} s={s} />)}</div></div>}
        </div>
      )}
    </div>
  );
}
