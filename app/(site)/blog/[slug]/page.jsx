import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, articleJsonLd, faqJsonLd } from '@/lib/seo';
import { getPost, relatedPosts, relatedPromptsForPost, relatedToolsForPost, getCategories } from '@/lib/data';
import { renderMarkdown } from '@/lib/markdown';
import { abs } from '@/lib/site';
import { PostCard, PromptCard, ToolCard } from '@/components/v2/Cards';
import Newsletter from '@/components/v2/Newsletter';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params; const p = await getPost(slug);
  if (!p) return { title: 'Not found', robots: { index: false } };
  const img = p.thumbnail || p.image2 || p.image1;
  return buildMetadata({ title: p.seo_title || p.title, description: p.seo_description || p.excerpt, path: `/blog/${slug}`, image: (p.og_image ? (/^https?:\/\//.test(p.og_image) ? p.og_image : abs(p.og_image)) : img) || undefined, type: 'article', publishedTime: p.publish_at || p.created_at, modifiedTime: p.updated_at });
}
export default async function Page({ params }) {
  const { slug } = await params; const p = await getPost(slug); if (!p) notFound();
  const [rel, relPrompts, relTools, pcats, tcats] = await Promise.all([relatedPosts(p, 3), relatedPromptsForPost(p, 3), relatedToolsForPost(p, 3), getCategories('prompt'), getCategories('tool')]);
  const pnames = Object.fromEntries(pcats.map((c) => [c.slug, c.name])); const tnames = Object.fromEntries(tcats.map((c) => [c.slug, c.name]));
  const { html, toc } = renderMarkdown(p.content || p.excerpt || '');
  const img = p.thumbnail || p.image2 || p.image1;
  const faq = (Array.isArray(p.faq) ? p.faq : []).filter((f) => f?.q && f?.a);
  const date = new Date(p.updated_at || p.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  return (<div className="wrap" style={{ paddingBottom: 56 }}>
    <nav className="crumbs"><Link href="/">Home</Link>/<Link href="/blog">Blog</Link>/<span>{p.title}</span></nav>
    <div className="two"><article>
      {p.category && <span className="tag ac">{p.category}</span>}
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.7rem)', marginTop: 10 }}>{p.title}</h1>
      <p className="muted" style={{ fontSize: '1.08rem' }}>{p.excerpt}</p>
      <p className="muted small">By <b>{p.author || 'Promptzyra Editorial Team'}</b> · Updated {date} · {p.read_time || '5 min read'}</p>
      {img && <img src={img} alt={p.image_alt || `${p.title} — illustration`} style={{ width: '100%', borderRadius: 14, margin: '10px 0 20px' }} />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {faq.length > 0 && <div className="prose"><h2>Frequently asked questions</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: 0 }}>{f.a}</p></details>)}</div>}
      <p className="disclose" style={{ marginTop: 28 }}>This article is for general information and education. See our <Link href="/editorial-policy">editorial policy</Link> and <Link href="/disclaimer">disclaimer</Link>.</p>
    </article>
    <aside style={{ display: 'grid', gap: 14 }}>
      {toc.length > 2 && <div className="panel"><h3>In this guide</h3><ul style={{ margin: 0, paddingLeft: 18 }}>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ul></div>}
      <div className="panel spot"><h3>Try it yourself</h3><p className="muted small">Copy a ready prompt or build a resume — free, in your browser.</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Link className="btn btn-sm" href="/prompts">Prompts</Link><Link className="btn btn-sm btn-primary" href="/resume-builder">Resume builder</Link></div></div>
    </aside></div>
    {relPrompts.length > 0 && <section style={{ marginTop: 40 }} aria-labelledby="h-rp"><h2 id="h-rp">Related prompts</h2><div className="pz-grid">{relPrompts.map((r) => <PromptCard key={r.slug} p={r} catName={pnames[r.category]} />)}</div></section>}
    {relTools.length > 0 && <section style={{ marginTop: 40 }} aria-labelledby="h-rt"><h2 id="h-rt">Related AI tools</h2><div className="pz-grid">{relTools.map((r) => <ToolCard key={r.slug} t={r} catName={tnames[r.category]} />)}</div></section>}
    {rel.length > 0 && <section style={{ marginTop: 40 }}><h2>Keep reading</h2><div className="grid g3">{rel.map((r) => <PostCard key={r.slug} p={r} />)}</div></section>}
    <div style={{ marginTop: 36 }}><Newsletter source="blog-post" /></div>
    <JsonLd data={[articleJsonLd({ title: p.title, description: p.seo_description || p.excerpt, image: img, published: p.publish_at || p.created_at, modified: p.updated_at, author: p.author, path: `/blog/${slug}` }), faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${slug}` }])]} />
  </div>);
}
