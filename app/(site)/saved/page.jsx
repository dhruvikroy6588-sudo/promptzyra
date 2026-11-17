'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { PromptCard } from '@/components/v2/Cards';
import CardPhoto from '@/components/v2/PhotoCards';
import { useFavList, toggleFav } from '@/components/v2/FavButton';

const PCOLS = 'slug,title,summary,category,models,level,copy_count,featured,prompt,type,example_image_url';
const HCOLS = 'slug,title,summary,category,tool,subject,style,image_url,image_alt,featured,copy_count';

export default function SavedPage() {
  const prompts = useFavList('prompt');
  const photos = useFavList('photo');
  const [data, setData] = useState({ prompts: [], photos: [] });
  const [loading, setLoading] = useState(true);
  const key = prompts.join('|') + '#' + photos.join('|');
  useEffect(() => {
    let dead = false;
    (async () => {
      const sb = getSupabase();
      if (!sb || (!prompts.length && !photos.length)) { if (!dead) { setData({ prompts: [], photos: [] }); setLoading(false); } return; }
      const [a, b] = await Promise.all([
        prompts.length ? sb.from('pz_prompts').select(PCOLS).in('slug', prompts.slice(0, 100)).then((r) => r, () => ({})) : { data: [] },
        photos.length ? sb.from('pz_photo_prompts').select(HCOLS).in('slug', photos.slice(0, 100)).then((r) => r, () => ({})) : { data: [] },
      ]);
      let pr = a.data || [];
      if (a.error) { const r = await sb.from('pz_prompts').select('slug,title,summary,category,models,level,copy_count,featured,prompt').in('slug', prompts.slice(0, 100)); pr = r.data || []; }
      if (!dead) { setData({ prompts: pr, photos: b.data || [] }); setLoading(false); }
    })();
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const total = prompts.length + photos.length;
  return (
    <div className="wrap page-pad">
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Saved prompts</h1>
      <p className="muted" style={{ maxWidth: 680 }}>Your saved items live only in this browser. Clearing site data or switching device will remove them.</p>
      {!loading && total === 0 && (
        <div className="empty saved-empty">
          <Heart size={28} aria-hidden="true" />
          <p><strong>Nothing saved yet.</strong> Tap the heart on any prompt to keep it here.</p>
          <p><Link href="/prompts" className="btn btn-primary">Browse prompts</Link> <Link href="/photo-prompts" className="btn">Photo prompts</Link> <Link href="/trending" className="btn">Trending</Link></p>
        </div>
      )}
      {loading && total > 0 && <p className="muted" role="status">Loading your saved items…</p>}
      {data.prompts.length > 0 && <>
        <h2 className="pl-h">Prompts ({data.prompts.length})</h2>
        <div className="grid g2">{data.prompts.map((p) => (
          <div key={p.slug} className="saved-item"><PromptCard p={p} /><button type="button" className="saved-rm" onClick={() => toggleFav('prompt', p.slug)} aria-label={`Remove ${p.title} from saved`}><X size={14} aria-hidden="true" /> Remove</button></div>
        ))}</div>
      </>}
      {data.photos.length > 0 && <>
        <h2 className="pl-h" style={{ marginTop: 36 }}>Photo prompts ({data.photos.length})</h2>
        <div className="grid g3">{data.photos.map((p) => (
          <div key={p.slug} className="saved-item"><CardPhoto p={p} /><button type="button" className="saved-rm" onClick={() => toggleFav('photo', p.slug)} aria-label={`Remove ${p.title} from saved`}><X size={14} aria-hidden="true" /> Remove</button></div>
        ))}</div>
      </>}
    </div>
  );
}
