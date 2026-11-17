'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
export default function ThemeToggle({ label = false }) {
  const [t, setT] = useState('dark');
  useEffect(() => {
    const read = () => setT(document.documentElement.dataset.theme || 'dark');
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  const flip = () => { const n = t === 'dark' ? 'light' : 'dark'; setT(n); document.documentElement.dataset.theme = n; try { localStorage.setItem('pz-theme', n); } catch (e) {} };
  const Icon = t === 'dark' ? Sun : Moon;
  if (label) return <button type="button" className="sb-theme" onClick={flip} aria-label="Toggle light or dark theme" title="Toggle theme"><Icon size={17} aria-hidden="true" /><span className="sb-text">{t === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>;
  return <button type="button" className="icon-btn" onClick={flip} aria-label="Toggle light or dark theme"><Icon size={18} aria-hidden="true" /></button>;
}
