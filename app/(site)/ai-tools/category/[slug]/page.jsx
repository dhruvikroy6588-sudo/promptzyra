import { icon } from '@/lib/site';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { getCategory } from '@/lib/data';
import ToolList from '@/components/v2/ToolList';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('tool', slug);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `Best ${c.name} AI Tools`, description: c.description || `Guides to AI tools for ${c.name.toLowerCase()}.`, path: `/ai-tools/category/${slug}`, noindex: !!(sp.q || sp.pricing || sp.sort) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('tool', slug);
  if (!c) notFound();
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/ai-tools">AI Tools</Link>/<span>{c.name}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{icon(c.icon)} {c.name} AI tools</h1><p className="muted prose">{c.description}</p>{c.intro && <div className="prose"><p>{c.intro}</p></div>}</div>
    <ToolList category={slug} sp={sp} base={`/ai-tools/category/${slug}`} />
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Tools', path: '/ai-tools' }, { name: c.name, path: `/ai-tools/category/${slug}` }])} />
  </>);
}
