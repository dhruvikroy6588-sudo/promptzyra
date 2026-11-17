'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
export default function CopyButton({ text, slug, label = 'Copy prompt', small }) {
  const [ok, setOk] = useState(false);
  const go = async () => {
    try { await navigator.clipboard.writeText(typeof text === 'function' ? text() : text); }
    catch (e) { const a = document.createElement('textarea'); a.value = typeof text === 'function' ? text() : text; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
    setOk(true); setTimeout(() => setOk(false), 1800);
    if (slug) { try { getSupabase()?.rpc('pz_bump_copy', { p_slug: slug }).then(() => {}, () => {}); } catch (e) {} }
  };
  return <button className={small ? 'btn btn-sm' : 'btn btn-primary'} onClick={go}>{ok ? <Check size={16} /> : <Copy size={16} />}{ok ? 'Copied' : label}</button>;
}
