import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listPrompts, listPhotoPrompts, getCategories } from '@/lib/data';
import { PromptCard } from '@/components/v2/Cards';
import CardPhoto from '@/components/v2/PhotoCards';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Trending AI Prompts', description: 'The most copied AI prompts and photo prompts on Promptzyra, ranked by how often people copy them. Fresh, free and reviewed.', path: '/trending' });

export default async function Page() {
  const [prompts, photos, pc, hc] = await Promise.all([
    listPrompts({ sort: 'popular', pageSize: 24 }),
    listPhotoPrompts({ sort: 'popular', pageSize: 12 }),
    getCategories('prompt'), getCategories('photo'),
  ]);
  const pn = Object.fromEntries(pc.map((c) => [c.slug, c.name]));
  const hn = Object.fromEntries(hc.map((c) => [c.slug, c.name]));
  const items = [
    ...prompts.rows.map((p) => ({ name: p.title, path: `/prompts/${p.slug}` })),
    ...photos.rows.map((p) => ({ name: p.title, path: `/photo-prompts/${p.slug}` })),
  ];
  return (
    <div className="wrap page-pad">
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Trending prompts</h1>
      <div className="prose muted" style={{ maxWidth: 760 }}>
        <p>These are the prompts people copy most on Promptzyra. Popularity is a rough signal of usefulness, not a guarantee of quality, so read each prompt, adapt it to your own situation and check the AI's answer before you rely on it.</p>
      </div>
      <h2 className="pl-h">Most copied prompts</h2>
      {prompts.rows.length ? <div className="grid g2">{prompts.rows.map((p) => <PromptCard key={p.slug} p={p} catName={pn[p.category]} />)}</div>
        : <div className="empty">Trending prompts will appear here soon. Meanwhile, <Link href="/prompts">browse the full library</Link>.</div>}
      {photos.rows.length > 0 && <>
        <h2 className="pl-h" style={{ marginTop: 40 }}>Most copied photo prompts</h2>
        <div className="grid g3">{photos.rows.map((p) => <CardPhoto key={p.slug} p={p} catName={hn[p.category]} />)}</div>
      </>}
      <p style={{ marginTop: 28 }}><Link href="/prompts" className="btn">All prompts</Link> <Link href="/photo-prompts" className="btn">All photo prompts</Link></p>
      <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Trending', path: '/trending' }]), itemListJsonLd(items)]} />
    </div>
  );
}
