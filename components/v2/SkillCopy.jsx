'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) {
    try { const a = document.createElement('textarea'); a.value = text; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok; } catch (x) { return false; }
  }
}
export function bumpSkill(slug) { if (!slug) return; try { getSupabase()?.rpc('pz_bump_skill_copy', { p_slug: slug }).then(() => {}, () => {}); } catch (e) {} }

// <SkillCopy text slug label small primary bump />  - bump=true calls rpc pz_bump_skill_copy(slug)
export default function SkillCopy({ text, slug, label = 'Copy', small = true, primary = false, bump = false, className = '' }) {
  const [ok, setOk] = useState(false);
  const go = async () => {
    await copyToClipboard(typeof text === 'function' ? text() : text);
    setOk(true); setTimeout(() => setOk(false), 1800);
    if (bump) bumpSkill(slug);
  };
  return <button type="button" className={`btn ${small ? 'btn-sm' : ''} ${primary ? 'btn-primary' : ''} ${className}`.trim()} onClick={go}>{ok ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{ok ? 'Copied' : label}</button>;
}
