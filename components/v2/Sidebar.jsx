'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronsLeft, Sparkles, Mail } from 'lucide-react';
import NavTree from './NavTree';
import ThemeToggle from './ThemeToggle';

// Collapsed state lives on <html data-side="rail"> (set by an inline script before paint) and in localStorage 'pz-side'.
export default function Sidebar({ categories }) {
  const [rail, setRail] = useState(false);
  useEffect(() => { setRail(document.documentElement.dataset.side === 'rail'); }, []);
  const toggle = () => {
    const next = !rail;
    setRail(next);
    document.documentElement.dataset.side = next ? 'rail' : 'wide';
    try { localStorage.setItem('pz-side', next ? 'rail' : 'wide'); } catch (e) {}
  };
  return (
    <aside className="sb" aria-label="Sidebar">
      <div className="sb-top">
        <Link href="/" className="logo" aria-label="Promptzyra home"><span className="logo-mark"><Sparkles size={16} /></span><span className="logo-t">Promptzyra</span></Link>
        <button type="button" className="sb-collapse" onClick={toggle} aria-pressed={rail} aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'} title={rail ? 'Expand sidebar' : 'Collapse sidebar'}><ChevronsLeft size={17} aria-hidden="true" /></button>
      </div>
      <div className="sb-scroll"><NavTree categories={categories} idPrefix="sb" /></div>
      <div className="sb-bot">
        <ThemeToggle label />
        <Link href="/contact" className="sb-contact" title="Contact"><Mail size={17} aria-hidden="true" /><span className="sb-text">Contact</span></Link>
      </div>
    </aside>
  );
}
