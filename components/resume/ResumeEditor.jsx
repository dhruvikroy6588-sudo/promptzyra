'use client';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Download, Eye, EyeOff, Trash2, ArrowUp, ArrowDown, Plus, RotateCcw, FileJson, Upload, LayoutTemplate, X, ChevronDown, ChevronRight } from 'lucide-react';
import ResumeView from './ResumeView';
import { TEMPLATES, CATEGORIES, PALETTES, getTemplate } from '@/lib/resume/templates';
import { SECTION_TYPES, newSection, newEntry, sampleResume, emptyResume, tags } from '@/lib/resume/model';

const KEY = 'pz-resume-v1';
const PAGE = { a4: [794, 1123], letter: [816, 1056] };

export default function ResumeEditor({ initialTemplate }) {
  const [data, setData] = useState(null);
  const [tid, setTid] = useState(initialTemplate || 't001');
  const [settings, setSettings] = useState({ paper: 'a4', scale: 1, accent: '', density: 'normal' });
  const [open, setOpen] = useState({ personal: true });
  const [picker, setPicker] = useState(false);
  const [cat, setCat] = useState('all');
  const [saved, setSaved] = useState('');
  const [mobile, setMobile] = useState('edit');
  const [menu, setMenu] = useState(false);
  const tpl = useMemo(() => getTemplate(tid), [tid]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw?.data) { setData(raw.data); setSettings((s) => ({ ...s, ...raw.settings })); if (!initialTemplate && raw.tid) setTid(raw.tid); }
      else setData(sampleResume());
    } catch (e) { setData(sampleResume()); }
  }, [initialTemplate]);
  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify({ data, tid, settings })); setSaved('Saved in your browser'); } catch (e) { setSaved('Could not save (storage full or blocked)'); } }, 400);
    return () => clearTimeout(t);
  }, [data, tid, settings]);

  // scale preview to fit
  const wrap = useRef(null); const pageBox = useRef(null);
  const [fit, setFit] = useState(1); const [h, setH] = useState(1123);
  const [pw, ph] = PAGE[settings.paper];
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (wrap.current) setFit(Math.min(1, (wrap.current.clientWidth - 8) / pw)); if (pageBox.current) setH(pageBox.current.offsetHeight); });
    if (wrap.current) ro.observe(wrap.current); if (pageBox.current) ro.observe(pageBox.current);
    return () => ro.disconnect();
  }, [pw, data, mobile]);
  const pages = Math.max(1, Math.ceil(h / ph));

  const upd = useCallback((d) => setData(d), []);
  const patchSec = (id, patch) => setData((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const move = (i, dir) => setData((d) => { const a = [...d.sections]; const j = i + dir; if (j < 0 || j >= a.length) return d; [a[i], a[j]] = [a[j], a[i]]; return { ...d, sections: a }; });
  const delSec = (id) => { if (confirm('Delete this section?')) setData((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) })); };
  const addItem = (sid) => patchSec(sid, { items: [...data.sections.find((s) => s.id === sid).items, newEntry()] });
  const patchItem = (sid, iid, p) => setData((d) => ({ ...d, sections: d.sections.map((s) => s.id === sid ? { ...s, items: s.items.map((it) => it.id === iid ? { ...it, ...p } : it) } : s) }));
  const delItem = (sid, iid) => setData((d) => ({ ...d, sections: d.sections.map((s) => s.id === sid ? { ...s, items: s.items.filter((it) => it.id !== iid) } : s) }));
  const moveItem = (sid, i, dir) => setData((d) => ({ ...d, sections: d.sections.map((s) => { if (s.id !== sid) return s; const a = [...s.items]; const j = i + dir; if (j < 0 || j >= a.length) return s; [a[i], a[j]] = [a[j], a[i]]; return { ...s, items: a }; }) }));

  const print = () => {
    const old = document.title; document.title = `${(data.personal.name || 'Resume').trim()} - Resume`;
    const done = () => { document.title = old; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done); setTimeout(() => window.print(), 50);
  };
  const exportJson = () => { const b = new Blob([JSON.stringify({ data, tid, settings }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'resume-data.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
  const importJson = (e) => { const f = e.target.files?.[0]; if (!f) return; f.text().then((t) => { try { const j = JSON.parse(t); if (!j?.data?.sections || !j?.data?.personal) throw 0; setData(j.data); if (j.tid) setTid(j.tid); if (j.settings) setSettings((s) => ({ ...s, ...j.settings })); } catch (x) { alert('This file is not a valid resume export.'); } }); e.target.value = ''; };

  if (!data) return <div className="wrap sec"><p className="muted">Loading editor…</p></div>;
  const shown = TEMPLATES.filter((t) => cat === 'all' || t.category === cat);
  const Field = ({ label, value, onChange, ph, area, rows = 3 }) => (<div><label>{label}</label>{area ? <textarea rows={rows} value={value} placeholder={ph} onChange={(e) => onChange(e.target.value)} /> : <input value={value} placeholder={ph} onChange={(e) => onChange(e.target.value)} />}</div>);

  return (
    <div className="rs-app">
      <style>{`@page{size:${settings.paper === 'letter' ? 'letter' : 'A4'};margin:0}@media print{html,body{background:#fff!important}.rs-app .no-print{display:none!important}.rs-print{display:block!important}.rs-print .rs-page{box-shadow:none!important}}`}</style>
      <div className="rs-top no-print">
        <div className="wrap rs-top-in">
          <button className="btn btn-sm" onClick={() => setPicker(true)}><LayoutTemplate size={15} />Template: {tpl.name}</button>
          <select value={settings.paper} onChange={(e) => setSettings({ ...settings, paper: e.target.value })} aria-label="Paper size" style={{ width: 'auto' }}><option value="a4">A4</option><option value="letter">US Letter</option></select>
          <select value={settings.density} onChange={(e) => setSettings({ ...settings, density: e.target.value })} aria-label="Spacing" style={{ width: 'auto' }}><option value="dense">Compact</option><option value="normal">Normal</option><option value="loose">Spacious</option></select>
          <select value={settings.scale} onChange={(e) => setSettings({ ...settings, scale: +e.target.value })} aria-label="Text size" style={{ width: 'auto' }}>{[[.9, 'Text 90%'], [1, 'Text 100%'], [1.08, 'Text 108%'], [1.16, 'Text 116%']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <span className="muted small rs-saved">{saved}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}><button className="btn btn-sm" onClick={() => setMenu(!menu)}>More <ChevronDown size={14} /></button>
              {menu && <div className="rs-menu" onMouseLeave={() => setMenu(false)}>
                <button onClick={exportJson}><FileJson size={14} />Export data (.json)</button>
                <label className="rs-file"><Upload size={14} />Import data<input type="file" accept="application/json" onChange={importJson} hidden /></label>
                <button onClick={() => { if (confirm('Replace your content with the sample resume?')) setData(sampleResume()); }}><RotateCcw size={14} />Load sample content</button>
                <button onClick={() => { if (confirm('Clear everything and start blank?')) setData(emptyResume()); }}><Trash2 size={14} />Start blank</button>
              </div>}</div>
            <button className="btn btn-primary btn-sm" onClick={print}><Download size={15} />Download PDF</button>
          </div>
        </div>
        <div className="rs-mtabs"><button className={mobile === 'edit' ? 'on' : ''} onClick={() => setMobile('edit')}>Edit</button><button className={mobile === 'view' ? 'on' : ''} onClick={() => setMobile('view')}>Preview</button></div>
      </div>

      <div className="wrap rs-grid">
        <aside className={`rs-panel no-print ${mobile === 'edit' ? '' : 'rs-hide'}`}>
          <div className="panel">
            <button className="rs-sh" onClick={() => setOpen({ ...open, personal: !open.personal })}>{open.personal ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<b>Personal details</b></button>
            {open.personal && <div className="grid g2" style={{ marginTop: 10 }}>
              {[['name', 'Full name'], ['title', 'Job title'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'City, Country'], ['website', 'Website'], ['linkedin', 'LinkedIn']].map(([k, l]) => <Field key={k} label={l} value={data.personal[k]} onChange={(v) => setData({ ...data, personal: { ...data.personal, [k]: v } })} />)}
            </div>}
          </div>
          {data.sections.map((s, i) => {
            const T = SECTION_TYPES[s.type]; const o = open[s.id];
            return (
              <div className="panel" key={s.id} id={`sec-${s.id}`} style={{ opacity: s.visible ? 1 : .6 }}>
                <div className="rs-sh-row">
                  <button className="rs-sh" onClick={() => setOpen({ ...open, [s.id]: !o })}>{o ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<b>{s.title || T.label}</b></button>
                  <div className="rs-acts">
                    <button title="Move up" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp size={14} /></button>
                    <button title="Move down" onClick={() => move(i, 1)} disabled={i === data.sections.length - 1}><ArrowDown size={14} /></button>
                    <button title={s.visible ? 'Hide from resume' : 'Show on resume'} onClick={() => patchSec(s.id, { visible: !s.visible })}>{s.visible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                    <button title="Delete section" onClick={() => delSec(s.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
                {o && <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                  <Field label="Section title" value={s.title} onChange={(v) => patchSec(s.id, { title: v })} />
                  {T.kind === 'text' && <Field area rows={5} label="Text" value={s.text} onChange={(v) => patchSec(s.id, { text: v })} ph="2–3 sentences about your strengths and goals" />}
                  {T.kind === 'tags' && <><Field area rows={3} label="Items (separate with commas)" value={s.text} onChange={(v) => patchSec(s.id, { text: v })} /><p className="muted small" style={{ margin: 0 }}>{tags(s.text).length} items</p></>}
                  {T.kind === 'entries' && <>
                    {s.items.map((it, n) => (
                      <div key={it.id} className="rs-item">
                        <div className="rs-item-h"><span className="muted small">{T.label} {n + 1}</span><span className="rs-acts"><button onClick={() => moveItem(s.id, n, -1)} disabled={n === 0}><ArrowUp size={13} /></button><button onClick={() => moveItem(s.id, n, 1)} disabled={n === s.items.length - 1}><ArrowDown size={13} /></button><button onClick={() => delItem(s.id, it.id)}><X size={13} /></button></span></div>
                        <div className="grid g2">
                          <Field label={T.f[0]} value={it.title} onChange={(v) => patchItem(s.id, it.id, { title: v })} />
                          <Field label={T.f[1]} value={it.subtitle} onChange={(v) => patchItem(s.id, it.id, { subtitle: v })} />
                          {T.f[2] && <Field label={T.f[2]} value={it.location} onChange={(v) => patchItem(s.id, it.id, { location: v })} />}
                          <div className="grid g2" style={{ gap: 8 }}><Field label="Start" value={it.start} onChange={(v) => patchItem(s.id, it.id, { start: v })} ph="Jan 2022" /><Field label="End" value={it.end} onChange={(v) => patchItem(s.id, it.id, { end: v })} ph="Present" /></div>
                        </div>
                        <div style={{ marginTop: 8 }}><Field area rows={4} label="Details (one bullet per line)" value={it.text} onChange={(v) => patchItem(s.id, it.id, { text: v })} /></div>
                      </div>
                    ))}
                    <button className="btn btn-sm" onClick={() => addItem(s.id)}><Plus size={14} />Add {T.label.toLowerCase()} entry</button>
                  </>}
                </div>}
              </div>
            );
          })}
          <div className="panel"><b>Add a section</b><div className="chips" style={{ justifyContent: 'flex-start', marginTop: 10 }}>{Object.entries(SECTION_TYPES).map(([k, v]) => <button key={k} className="chip" onClick={() => { const s = newSection(k); setData({ ...data, sections: [...data.sections, s] }); setOpen({ ...open, [s.id]: true }); setTimeout(() => document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60); }}><Plus size={12} />{v.label}</button>)}</div></div>
          <div className="panel"><b>Accent colour</b><div className="rs-sw"><button className={!settings.accent ? 'on' : ''} onClick={() => setSettings({ ...settings, accent: '' })} title="Template default">Default</button>{PALETTES.map((p) => <button key={p.name} title={p.name} className={settings.accent === p.accent ? 'on' : ''} style={{ background: p.accent }} onClick={() => setSettings({ ...settings, accent: p.accent })} />)}</div></div>
          <p className="muted small">Tip: you can also click directly on the resume to type. Your data never leaves this browser. Use “Download PDF” and choose “Save as PDF” in the print window (turn off headers and footers).</p>
        </aside>

        <section className={`rs-preview no-print ${mobile === 'view' ? '' : 'rs-hide'}`} ref={wrap} aria-label="Resume preview">
          <div style={{ height: h * fit, width: pw * fit, margin: '0 auto', position: 'relative' }}>
            <div ref={pageBox} style={{ transform: `scale(${fit})`, transformOrigin: 'top left', width: pw, position: 'absolute', left: 0, top: 0, boxShadow: '0 8px 40px rgba(0,0,0,.35)' }}>
              <ResumeView data={data} tpl={tpl} settings={settings} edit onChange={upd} onOpenSection={(id) => { setMobile('edit'); setOpen((o) => ({ ...o, [id]: true })); setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60); }} />
              {Array.from({ length: pages - 1 }, (_, k) => <div key={k} className="rs-break" style={{ top: ph * (k + 1) }}><span>Page {k + 2} starts</span></div>)}
            </div>
          </div>
          <p className="muted small" style={{ textAlign: 'center', marginTop: 10 }}>{pages} page{pages > 1 ? 's' : ''} · {settings.paper === 'a4' ? 'A4' : 'US Letter'}</p>
        </section>
      </div>

      <div className="rs-print"><ResumeView data={data} tpl={tpl} settings={settings} /></div>

      {picker && <div className="cmd-back no-print" onMouseDown={(e) => { if (e.target === e.currentTarget) setPicker(false); }}>
        <div className="rs-modal" role="dialog" aria-modal="true" aria-label="Choose template">
          <div className="rs-modal-h"><b>Choose a template ({shown.length})</b><button className="icon-btn" onClick={() => setPicker(false)} aria-label="Close"><X size={16} /></button></div>
          <div className="chips" style={{ justifyContent: 'flex-start', padding: '0 16px 10px' }}><button className={`chip${cat === 'all' ? ' on' : ''}`} onClick={() => setCat('all')}>All</button>{CATEGORIES.map((c) => <button key={c.slug} className={`chip${cat === c.slug ? ' on' : ''}`} onClick={() => setCat(c.slug)}>{c.name}</button>)}</div>
          <div className="rs-tgrid">{shown.map((t) => <button key={t.id} className={`rs-tcard${t.id === tid ? ' on' : ''}`} onClick={() => { setTid(t.id); setPicker(false); }}><img className="rs-thumb" src={`/resume-thumbs/${t.id}.webp`} alt={`${t.name} resume template`} loading="lazy" width="210" height="297" /><span>{t.name}</span></button>)}</div>
        </div>
      </div>}
    </div>
  );
}
