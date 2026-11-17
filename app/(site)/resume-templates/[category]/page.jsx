import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { TEMPLATES, CATEGORIES } from '@/lib/resume/templates';
import Gallery from '@/components/resume/Gallery';
import JsonLd from '@/components/v2/JsonLd';
export const generateStaticParams = () => CATEGORIES.map((c) => ({ category: c.slug }));
export async function generateMetadata({ params }) {
  const { category } = await params; const c = CATEGORIES.find((x) => x.slug === category);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `${c.name} Resume Templates — Free & Editable`, description: `${c.blurb} Free ${c.name.toLowerCase()} resume templates you can edit online and download as PDF.`, path: `/resume-templates/${category}` });
}
export default async function Page({ params }) {
  const { category } = await params; const c = CATEGORIES.find((x) => x.slug === category);
  if (!c) notFound();
  const list = TEMPLATES.filter((t) => t.category === category);
  return (<div className="wrap"><nav className="crumbs"><Link href="/">Home</Link>/<Link href="/resume-templates">Templates</Link>/<span>{c.name}</span></nav>
    <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{c.name} resume templates</h1><p className="muted prose">{c.blurb}</p>
    <Gallery list={list} /><div className="chips" style={{ justifyContent: 'flex-start', margin: '28px 0 56px' }}>{CATEGORIES.filter((x) => x.slug !== category).map((x) => <Link key={x.slug} className="chip" href={`/resume-templates/${x.slug}`}>{x.name}</Link>)}</div>
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Templates', path: '/resume-templates' }, { name: c.name, path: `/resume-templates/${category}` }])} /></div>);
}
