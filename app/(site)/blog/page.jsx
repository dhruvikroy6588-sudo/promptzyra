import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { listBlog, getCategories, getFeaturedPost } from '@/lib/data';
import { PostCard } from '@/components/v2/Cards';
import Pager from '@/components/v2/Pager';
import Newsletter from '@/components/v2/Newsletter';
import FeaturedPost from '@/components/v2/FeaturedPost';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  return buildMetadata({ title: 'AI Guides & Articles for Students and Job Seekers', description: 'Practical, plain-language guides on using AI for study, writing, careers and everyday work — written and reviewed by the Promptzyra team.', path: '/blog', noindex: !!sp.q || sp.sort === 'oldest' || parseInt(sp.page) > 1 });
}
export default async function Page({ searchParams }) {
  const sp = await searchParams; const page = Math.max(1, parseInt(sp.page) || 1); const q = sp.q || ''; const sort = sp.sort === 'oldest' ? 'oldest' : 'newest';
  const showFeatured = page === 1 && !q && sort === 'newest';
  const [cats, featured] = await Promise.all([getCategories('blog'), showFeatured ? getFeaturedPost() : null]);
  const res = await listBlog({ page, q, sort, excludeSlug: featured?.slug });
  const total = res.total + (featured ? 1 : 0);
  const sortHref = (s) => { const p = new URLSearchParams(); if (q) p.set('q', q); if (s !== 'newest') p.set('sort', s); const t = p.toString(); return t ? `/blog?${t}` : '/blog'; };
  return (<div className="wrap" style={{ paddingBottom: 56 }}>
    <h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Guides & articles</h1><p className="muted prose">Practical explanations, how-tos and honest tool comparisons for students, teachers and job seekers.</p>
    <div className="chips" style={{ justifyContent: 'flex-start', margin: '14px 0' }}><Link className="chip on" href="/blog">All</Link>{cats.map((c) => <Link key={c.slug} className="chip" href={`/blog/category/${c.slug}`}>{c.name}</Link>)}</div>
    {featured && <FeaturedPost p={featured} />}
    <form className="toolbar" action="/blog" role="search"><input name="q" defaultValue={q} placeholder="Search articles…" aria-label="Search articles" />{sort === 'oldest' && <input type="hidden" name="sort" value="oldest" />}<button className="btn" type="submit">Search</button>
      <span className="chips" aria-label="Sort articles"><Link className={`chip${sort === 'newest' ? ' on' : ''}`} href={sortHref('newest')}>Newest</Link><Link className={`chip${sort === 'oldest' ? ' on' : ''}`} href={sortHref('oldest')} rel="nofollow">Oldest</Link></span></form>
    {res.rows.length ? <div className="grid g3">{res.rows.map((p) => <PostCard key={p.slug} p={p} />)}</div> : !featured && <div className="empty">New articles are coming soon.</div>}
    <Pager page={page} total={res.total} pageSize={12} base="/blog" params={{ q, sort: sort !== 'newest' ? sort : '' }} />
    <div style={{ marginTop: 40 }}><Newsletter source="blog" /></div>
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />
  </div>);
}
