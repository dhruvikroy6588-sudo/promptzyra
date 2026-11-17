'use client';
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
export default function ShareButton({ title, path, className = 'btn btn-sm' }) {
  const [done, setDone] = useState(false);
  const go = async () => {
    const url = path ? new URL(path, window.location.origin).toString() : window.location.href;
    try { if (navigator.share) { await navigator.share({ title, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 1800); } catch (e) { window.prompt('Copy this link', url); }
  };
  return <button type="button" className={className} onClick={go} aria-live="polite">{done ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}{done ? 'Link copied' : 'Share'}</button>;
}
