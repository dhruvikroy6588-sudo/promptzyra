import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { getCategory, listPhotoPrompts } from '@/lib/data';
import PhotoList from '@/components/v2/PhotoList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('photo', slug);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `${c.name} Photo Prompts`, description: c.description || `Photo prompts for ${c.name.toLowerCase()} to use with your own picture in ChatGPT.`, path: `/photo-prompts/category/${slug}`, noindex: !!(sp.q || sp.tool || sp.subject || sp.sort) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('photo', slug);
  if (!c) notFound();
  const n = c.name.toLowerCase();
  const top = await listPhotoPrompts({ category: slug, pageSize: 12 });
  const faq = [
    { q: `What are ${n} photo prompts?`, a: `They are instructions you paste into an AI image tool together with your own photo to get a ${n} style image. Each one lists the tools it suits.` },
    { q: 'Can I use someone else\'s photo?', a: 'Only with their clear permission. Use photos you own or have the right to edit, and label AI-generated results as AI-generated when you share them.' },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/photo-prompts">Photo Prompts</Link>/<span>{c.name}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{c.name} photo prompts</h1>
      <p className="muted prose">{c.description}</p>
      {c.intro && <div className="prose intro-long"><p>{c.intro}</p></div>}
      <div className="prose intro-long muted"><p>Every {n} prompt on this page is designed to be used with a photo you upload yourself. Pick a prompt, copy it, attach your picture in ChatGPT, and adjust the result until it looks right.</p></div></div>
    <PhotoList sp={sp} base={`/photo-prompts/category/${slug}`} fixed={{ category: slug }} />
    <PromptFaq items={faq} title={`${c.name} photo prompts FAQ`} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Photo Prompts', path: '/photo-prompts' }, { name: c.name, path: `/photo-prompts/category/${slug}` }]), top.rows.length ? itemListJsonLd(top.rows.map((p) => ({ name: p.title, path: `/photo-prompts/${p.slug}` }))) : null]} />
  </>);
}
