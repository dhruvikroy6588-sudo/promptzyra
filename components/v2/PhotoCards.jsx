'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Share2, ArrowUpRight } from 'lucide-react';
import PhotoPlaceholder from './PhotoPlaceholder';
import FavButton from './FavButton';
import { photoToolLabel, photoSubjectLabel } from '@/lib/photo';

const KEY = 'pz-photo-likes';
const EVT = 'pz-photo-likes-change';
export const readLikes = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch (e) { return []; } };
const writeLikes = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} try { window.dispatchEvent(new Event(EVT)); } catch (e) {} };

export function usePhotoLikes() {
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    const sync = () => setLikes(readLikes());
    sync();
    window.addEventListener(EVT, sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
  }, []);
  const toggle = useCallback((slug) => {
    const cur = readLikes();
    writeLikes(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);
  return { likes, toggle };
}

export async function sharePhoto(title, path) {
  const url = `${window.location.origin}${path}`;
  try { if (navigator.share) { await navigator.share({ title, url }); return 'shared'; } } catch (e) { if (e && e.name === 'AbortError') return ''; }
  try { await navigator.clipboard.writeText(url); }
  catch (e) { const a = document.createElement('textarea'); a.value = url; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (x) {} a.remove(); }
  return 'copied';
}

export function LikeButton({ slug, small }) {
  const { likes, toggle } = usePhotoLikes();
  const on = likes.includes(slug);
  return <button type="button" className={`ph-act${on ? ' on' : ''}`} aria-pressed={on} aria-label={on ? 'Remove from saved' : 'Save this prompt'} onClick={() => toggle(slug)}><Heart size={small ? 15 : 17} fill={on ? 'currentColor' : 'none'} /><span>{on ? 'Liked' : 'Like'}</span></button>;
}
export function ShareButton({ title, path }) {
  const [msg, setMsg] = useState('');
  const go = async () => { const r = await sharePhoto(title, path); if (r === 'copied') { setMsg('Link copied'); setTimeout(() => setMsg(''), 1800); } };
  return <button type="button" className="ph-act" onClick={go} aria-label={`Share ${title}`}><Share2 size={16} /><span>{msg || 'Share'}</span></button>;
}

export function CardPhoto({ p, catName, priority }) {
  const href = `/photo-prompts/${p.slug}`;
  return (
    <article className="ph-card">
      <Link href={href} className="ph-img" aria-label={`Open ${p.title}`}>
        {p.image_url
          ? <img src={p.image_url} alt={p.image_alt || `${p.title} - example AI photo result`} loading={priority ? 'eager' : 'lazy'} decoding="async" />
          : <PhotoPlaceholder seed={p.category || p.subject || p.slug} label={`${p.title} cover`} />}
        <span className="ph-badge">{photoToolLabel(p.tool)}</span>
      </Link>
      <div className="pz-fav pz-fav-img"><FavButton kind="photo" slug={p.slug} /></div>
      <div className="ph-body">
        <div className="ph-tags">{(p.featured || p.copy_count >= 25) && <span className="pz-pop">Popular</span>}{catName && <span className="tag ac">{catName}</span>}{p.subject && p.subject !== 'other' && <span className="tag">{photoSubjectLabel(p.subject)}</span>}</div>
        <h3><Link href={href}>{p.title}</Link></h3>
        <p className="ph-sum">{p.summary}</p>
        <div className="ph-acts">
          <LikeButton slug={p.slug} small />
          <ShareButton title={p.title} path={href} />
          <Link href={href} className="ph-act ph-open">Open <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  );
}
export default CardPhoto;
