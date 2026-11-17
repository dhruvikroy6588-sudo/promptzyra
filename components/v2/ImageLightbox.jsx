'use client';
import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

// Click-to-zoom preview. Esc, backdrop click or the close button dismiss it; focus returns to the trigger.
export default function ImageLightbox({ src, alt, caption }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const closeBtn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); if (e.key === 'Tab') { e.preventDefault(); closeBtn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    closeBtn.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; trigger.current?.focus(); };
  }, [open]);
  return (
    <figure className="pz-lb-fig">
      <button type="button" ref={trigger} className="pz-lb-trigger" onClick={() => setOpen(true)} aria-label={`Enlarge image: ${alt}`} aria-haspopup="dialog">
        <img src={src} alt={alt} loading="lazy" />
        <span className="pz-lb-hint"><ZoomIn size={15} aria-hidden="true" />Click to zoom</span>
      </button>
      {caption && <figcaption className="muted small">{caption}</figcaption>}
      {open && (
        <div className="pz-lb" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <button type="button" ref={closeBtn} className="pz-lb-close" onClick={() => setOpen(false)} aria-label="Close preview"><X size={20} /></button>
          <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </figure>
  );
}
