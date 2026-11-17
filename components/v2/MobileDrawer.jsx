'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import NavTree from './NavTree';

export default function MobileDrawer({ categories }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef(null);
  const btnRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', k);
    const mq = window.matchMedia('(min-width:1024px)');
    const m = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener?.('change', m);
    setTimeout(() => closeRef.current?.focus(), 30);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); mq.removeEventListener?.('change', m); btnRef.current?.focus?.(); };
  }, [open]);
  return (
    <>
      <button ref={btnRef} type="button" className="icon-btn menu-btn" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-drawer" onClick={() => setOpen(true)}><Menu size={19} aria-hidden="true" /></button>
      {mounted && createPortal(<>
      <div className={`drawer-ov${open ? ' on' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="mobile-drawer" className={`drawer${open ? ' on' : ''}`} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open}>
        <div className="drawer-h"><span className="drawer-t">Menu</span><button ref={closeRef} type="button" className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}><X size={19} aria-hidden="true" /></button></div>
        <div className="drawer-b"><NavTree categories={categories} idPrefix="dr" onNavigate={() => setOpen(false)} /></div>
      </aside>
      </>, document.body)}
    </>
  );
}
