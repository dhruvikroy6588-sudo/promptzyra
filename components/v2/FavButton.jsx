'use client';
import { useCallback, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

// Stable API: <FavButton kind="prompt|photo|tool" slug size />, useFav(kind, slug), useFavList(kind), readFav(kind), toggleFav(kind, slug)
// Storage: prompt -> 'pz-saved-prompts', photo -> 'pz-photo-likes' (shared with PhotoCards.jsx), tool -> 'pz-saved-tools'. All are JSON arrays of slugs.
export const FAV_KEYS = { prompt: 'pz-saved-prompts', photo: 'pz-photo-likes', tool: 'pz-saved-tools' };
const LABEL = { prompt: 'prompt', photo: 'photo prompt', tool: 'tool' };

export function readFav(kind) {
  try { const v = JSON.parse(localStorage.getItem(FAV_KEYS[kind]) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch (e) { return []; }
}
function writeFav(kind, list) {
  try { localStorage.setItem(FAV_KEYS[kind], JSON.stringify(list)); } catch (e) {}
  try { if (kind === 'photo') window.dispatchEvent(new Event('pz-photo-likes-change')); } catch (e) {}
}
export function toggleFav(kind, slug) {
  const cur = readFav(kind);
  const on = !cur.includes(slug);
  writeFav(kind, on ? [...cur, slug] : cur.filter((s) => s !== slug));
  try { window.dispatchEvent(new CustomEvent('pz-fav', { detail: { kind, slug, on } })); } catch (e) {}
  return on;
}

export function useFavList(kind) {
  const [list, setList] = useState([]);
  useEffect(() => {
    const sync = () => setList(readFav(kind));
    sync();
    window.addEventListener('pz-fav', sync); window.addEventListener('pz-photo-likes-change', sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener('pz-fav', sync); window.removeEventListener('pz-photo-likes-change', sync); window.removeEventListener('storage', sync); };
  }, [kind]);
  return list;
}

export function useFav(kind, slug) {
  const list = useFavList(kind);
  const toggle = useCallback(() => toggleFav(kind, slug), [kind, slug]);
  return { on: list.includes(slug), toggle, list };
}

export default function FavButton({ kind = 'prompt', slug, size = 18, className = '' }) {
  const { on, toggle } = useFav(kind, slug);
  const label = on ? `Remove ${LABEL[kind] || 'item'} from saved` : `Save ${LABEL[kind] || 'item'}`;
  return (
    <button type="button" className={`fav-btn${on ? ' on' : ''} ${className}`.trim()} aria-pressed={on} aria-label={label} title={label}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}>
      <Heart size={size} fill={on ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}
