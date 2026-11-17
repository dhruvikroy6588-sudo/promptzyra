'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
const QUICK = [
  ['Prompt library', '/prompts'], ['AI tools directory', '/ai-tools'], ['Resume builder', '/resume-builder'], ['Resume templates', '/resume-templates'],
  ['Cover letter builder', '/cover-letter-builder'], ['ATS resume checker', '/ats-resume-checker'], ['Prompt builder', '/prompt-builder'], ['Study planner', '/study-planner'], ['Blog', '/blog'],
];
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const r = useRouter();
  const ref = useRef(null);
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); } if (e.key === 'Escape') setOpen(false); };
    const o = () => setOpen(true);
    window.addEventListener('keydown', k); window.addEventListener('pz-open-search', o);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('pz-open-search', o); };
  }, []);
  useEffect(() => { if (open) setTimeout(() => ref.current?.focus(), 30); }, [open]);
  const go = (e) => { e.preventDefault(); if (q.trim()) { r.push('/search?q=' + encodeURIComponent(q.trim())); setOpen(false); setQ(''); } };
  if (!open) return null;
  const items = QUICK.filter(([n]) => !q || n.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="cmd-back" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }} role="dialog" aria-modal="true" aria-label="Search">
      <form className="cmd" onSubmit={go}>
        <div className="cmd-in"><Search size={18} /><input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts, AI tools, guides… (Enter)" aria-label="Search" /></div>
        <div className="cmd-list">
          {q.trim() && <button type="submit" className="cmd-item">Search all for “{q.trim()}”</button>}
          {items.map(([n, h]) => <button type="button" key={h} className="cmd-item" onClick={() => { r.push(h); setOpen(false); }}>{n}<span>{h}</span></button>)}
        </div>
      </form>
    </div>
  );
}
