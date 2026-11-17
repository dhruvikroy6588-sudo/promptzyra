'use client';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { CardPhoto, usePhotoLikes } from './PhotoCards';
import { getSupabase } from '@/lib/supabase';

const COLS = 'slug,title,summary,category,tool,subject,style,tags,image_url,image_alt,featured,copy_count,publish_at,created_at,updated_at';

// Renders the server-fetched page of cards; the "Saved" toggle swaps in the viewer's liked prompts (localStorage), fetched by slug.
export default function PhotoGrid({ rows, names = {}, emptyText }) {
  const { likes } = usePhotoLikes();
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const key = likes.join('|');
  useEffect(() => {
    if (!saved) return;
    if (!likes.length) { setItems([]); return; }
    const sb = getSupabase();
    if (!sb) { setItems(rows.filter((r) => likes.includes(r.slug))); return; }
    let live = true; setBusy(true);
    sb.from('pz_photo_prompts').select(COLS).in('slug', likes.slice(0, 100)).then(({ data, error }) => {
      if (!live) return;
      setItems(error ? rows.filter((r) => likes.includes(r.slug)) : data || []); setBusy(false);
    }, () => { if (live) { setItems(rows.filter((r) => likes.includes(r.slug))); setBusy(false); } });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved, key]);
  const shown = saved ? items : rows;
  return (
    <div>
      <div className="ph-savebar">
        <button type="button" className={`chip${saved ? ' on' : ''}`} aria-pressed={saved} onClick={() => setSaved((s) => !s)}><Heart size={14} fill={saved ? 'currentColor' : 'none'} /> Saved{likes.length ? ` (${likes.length})` : ''}</button>
        {saved && <span className="muted small">Showing prompts you liked on this device.</span>}
      </div>
      {shown.length
        ? <div className="ph-grid">{shown.map((p, i) => <CardPhoto key={p.slug} p={p} catName={names[p.category]} priority={!saved && i < 3} />)}</div>
        : <div className="empty">{saved ? (busy ? 'Loading your saved prompts...' : 'No saved prompts yet. Tap Like on any card to save it here.') : emptyText}</div>}
    </div>
  );
}
