'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { LikeButton, ShareButton } from './PhotoCards';

async function copyPrompt(prompt, slug) {
  try { await navigator.clipboard.writeText(prompt); }
  catch (e) { const a = document.createElement('textarea'); a.value = prompt; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (x) {} a.remove(); }
  try { getSupabase()?.rpc('pz_bump_photo_copy', { p_slug: slug }).then(() => {}, () => {}); } catch (e) {}
}
const words = (t) => (String(t).trim().match(/\S+/g) || []).length;
// "**label**" becomes <strong>; blank lines separate paragraphs.
const renderLine = (line) => line.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));

export function CopyButton2({ prompt, slug, label = 'Copy prompt', className = 'btn btn-primary' }) {
  const [ok, setOk] = useState(false);
  const go = async () => { await copyPrompt(prompt, slug); setOk(true); setTimeout(() => setOk(false), 1800); };
  return <button type="button" className={className} onClick={go}>{ok ? <Check size={16} /> : <Copy size={16} />}{ok ? 'Copied' : label}</button>;
}

export function PhotoCopyBox({ prompt, slug }) {
  const paras = String(prompt).split(/\n\s*\n/).filter((x) => x.trim());
  return (
    <div>
      <div className="ph-master">
        <div className="ph-master-top"><span className="ph-kicker">MASTER PROMPT</span><span className="ph-kicker">{words(prompt)} words</span></div>
        <div className="ph-prompt" tabIndex={0}>{paras.map((p, i) => <p key={i}>{p.split('\n').map((l, j) => <span key={j}>{j > 0 && <br />}{renderLine(l)}</span>)}</p>)}</div>
      </div>
      <CopyButton2 prompt={prompt} slug={slug} label="Copy full prompt" className="btn btn-primary ph-copyfull" />
    </div>
  );
}
export function PhotoDetailActions({ slug, title }) {
  return <div className="ph-acts ph-acts-lg"><LikeButton slug={slug} /><ShareButton title={title} path={`/photo-prompts/${slug}`} /></div>;
}
export function PhotoShare({ slug, title }) { return <ShareButton title={title} path={`/photo-prompts/${slug}`} />; }
