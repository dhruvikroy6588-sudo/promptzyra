'use client';
import { useEffect } from 'react';
export default function CursorFX() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer:fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (!fine || reduce) return;
    const root = document.documentElement;
    let x = 0, y = 0, raf = 0;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty('--mx', x + 'px');
        root.style.setProperty('--my', y + 'px');
        root.classList.add('fx-on');
        const c = e.target.closest && e.target.closest('.spot');
        if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--cx', (x - r.left) + 'px'); c.style.setProperty('--cy', (y - r.top) + 'px'); }
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div className="cursor-glow" aria-hidden="true" />;
}
