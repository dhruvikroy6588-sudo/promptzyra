'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
export default function ThemeToggle() {
  const [t, setT] = useState('dark');
  useEffect(() => { setT(document.documentElement.dataset.theme || 'dark'); }, []);
  const flip = () => { const n = t === 'dark' ? 'light' : 'dark'; setT(n); document.documentElement.dataset.theme = n; try { localStorage.setItem('pz-theme', n); } catch (e) {} };
  return <button className="icon-btn" onClick={flip} aria-label="Toggle light or dark theme">{t === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
