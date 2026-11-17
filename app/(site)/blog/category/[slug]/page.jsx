import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { listBlog, getCategory, getCategories } from '@/lib/data';
import { PostCard } from '@/components/v2/Cards';
import Pager from '@/components/v2/Pager';
import Newsletter from '@/components/v2/Newsletter';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams; const c = await getCategory('blog', slug);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `${c.name} — Guides & Articles`, description: c.description, path: `/blog/category/${slug}`, noindex: parseInt(sp.page) > 1 || sp.sort === 'oldest' });
}
export default async function Page({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams; const page = Math.max(1, parseInt(sp.page) || 1); const sort = sp.sort === 'oldest' ? 'oldest' : 'newest';
  const c = await getCategory('blog', slug); if (!c) notFound();
  const [res, cats] = await Promise.all([listBlog({ category: c.name, page, sort }), getCategories('blog')]); const alt = res.rows.length ? res : await listBlog({ category: slug, page, sort });
  const base = `/blog/category/${slug}`;
  return (<div className="wrap" style={{ paddingBottom: 56 }}><nav className="crumbs"><Link href="/">Home</Link>/<Link href="/blog">Blog</Link>/<span>{c.name}</span></nav>
    <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{c.name}</h1><p className="muted prose">{c.description}</p>
    <div className="chips" style={{ justifyContent: 'flex-start', margin: '14px 0' }}><Link className="chip" href="/blog">All</Link>{cats.map((x) => <Link key={x.slug} className={`chip${x.slug === slug ? ' on' : ''}`} href={`/blog/category/${x.slug}`}>{x.name}</Link>)}<span style={{ flex: 1 }} /><Link className={`chip${sort === 'newest' ? ' on' : ''}`} href={base}>Newest</Link><Link className={`chip${sort === 'oldest' ? ' on' : ''}`} href={`${base}?sort=oldest`} rel="nofollow">Oldest</Link></div>
    {alt.rows.length ? <div className="grid g3">{alt.rows.map((p) => <PostCard key={p.slug} p={p} />)}</div> : <div className="empty">No articles in this category yet.</div>}
    <Pager page={page} total={alt.total} pageSize={12} base={base} params={{ sort: sort !== 'newest' ? sort : '' }} />
    <div style={{ marginTop: 40 }}><Newsletter source="blog-category" /></div>
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: c.name, path: `/blog/category/${slug}` }])} /></div>);
}
