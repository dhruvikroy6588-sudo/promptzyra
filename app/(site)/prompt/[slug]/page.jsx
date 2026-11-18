import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';
import { buildMetadata, breadcrumbJsonLd, articleJsonLd, faqJsonLd } from '@/lib/seo';
import { renderMarkdown } from '@/lib/markdown';
import { abs } from '@/lib/site';
import SkillCopy from '@/components/v2/SkillCopy';
import Newsletter from '@/components/v2/Newsletter';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';

// Older prompt cards live in promptzyra_posts and keep their original /prompt/<slug> URLs (Pinterest, Google).
async function getCard(slug) {
  try {
    const sb = getSupabaseServer(); if (!sb) return null;
    const { data } = await sb.from('promptzyra_posts').select('*').eq('slug', slug).eq('published', true).maybeSingle();
    return data || null;
  } catch (e) { return null; }
}
async function getMore(p) {
  try {
    const sb = getSupabaseServer(); if (!sb) return [];
    let q = sb.from('promptzyra_posts').select('slug,title,excerpt,category,thumbnail,image1,image2,kind').eq('published', true).neq('slug', p.slug).limit(6);
    if (p.category) q = q.eq('category', p.category);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  } catch (e) { return []; }
}
const asList = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);

export async function generateMetadata({ params }) {
  const { slug } = await params; const p = await getCard(slug);
  if (!p) return { title: 'Prompt not found', robots: { index: false, follow: false } };
  const img = p.thumbnail || p.image2 || p.image1;
  return buildMetadata({ title: p.seo_title || `${p.title} | AI Prompt`, description: p.seo_description || p.excerpt, path: `/prompt/${slug}`, image: (p.og_image ? (/^https?:\/\//.test(p.og_image) ? p.og_image : abs(p.og_image)) : img) || undefined, type: 'article' });
}

export default async function Page({ params }) {
  const { slug } = await params; const p = await getCard(slug); if (!p) notFound();
  const more = await getMore(p);
  const img = p.thumbnail || p.image2 || p.image1;
  const tips = asList(p.tips); const tags = asList(p.tags);
  const faq = asList(p.faq).filter((f) => f?.q && f?.a);
  const { html } = renderMarkdown(p.content || '');
  const date = new Date(p.updated_at || p.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  return (<div className="wrap" style={{ paddingBottom: 56 }}>
    <nav className="crumbs"><Link href="/">Home</Link>/<Link href="/prompts">Prompts</Link>/<span>{p.title}</span></nav>
    <div className="two"><article>
      {p.category && <span className="tag ac">{p.category}</span>}
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.7rem)', marginTop: 10 }}>{p.title}</h1>
      {p.excerpt && <p className="muted" style={{ fontSize: '1.08rem' }}>{p.excerpt}</p>}
      <p className="muted small">By <b>{p.author || 'Promptzyra Editorial Team'}</b> · Updated {date} · {p.read_time || '3 min read'}</p>
      {img && <img src={img} alt={p.image_alt || `${p.title} example image`} style={{ width: '100%', borderRadius: 14, margin: '10px 0 20px' }} />}
      {p.prompt && <section className="panel" style={{ margin: '0 0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}><h2 style={{ margin: 0, fontSize: '1.2rem' }}>Prompt</h2><SkillCopy text={p.prompt} label="Copy prompt" small={false} primary /></div>
        <pre className="prompt-box" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', margin: '14px 0 0', fontFamily: 'inherit', lineHeight: 1.65 }}>{p.prompt}</pre>
      </section>}
      {tips.length > 0 && <section style={{ margin: '0 0 24px' }}><h2>Tips for better results</h2><ul>{tips.map((t, i) => <li key={i}>{typeof t === 'string' ? t : t?.text}</li>)}</ul></section>}
      {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
      {tags.length > 0 && <div className="pz-tags" style={{ marginTop: 18 }}>{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
      {faq.length > 0 && <section className="faq-box" style={{ marginTop: 28 }}><h2>Frequently asked questions</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>}
      <p className="disclose" style={{ marginTop: 28 }}>Results vary between AI tools and runs. Only use photos you own or have permission to use. See our <Link href="/disclaimer">disclaimer</Link>.</p>
    </article>
    <aside style={{ display: 'grid', gap: 14 }}>
      <div className="panel spot"><h3>Explore more</h3><p className="muted small">Free ready-made prompts, AI tools and skills.</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Link className="btn btn-sm" href="/prompts">Prompts</Link><Link className="btn btn-sm" href="/photo-prompts">Photo prompts</Link><Link className="btn btn-sm" href="/ai-tools">AI tools</Link></div></div>
    </aside></div>
    {more.length > 0 && <section style={{ marginTop: 40 }}><h2>More prompts</h2><div className="pz-grid">{more.map((r) => (
      <article key={r.slug} className="pz-card pz-pc">
        {r.category && <div className="pz-tags"><span className="tag ac">{r.category}</span></div>}
        <h3 className="pz-title"><Link href={`/prompt/${r.slug}`} className="pz-stretch">{r.title}</Link></h3>
        {r.excerpt && <p className="pz-sum">{r.excerpt}</p>}
      </article>))}</div></section>}
    <div style={{ marginTop: 36 }}><Newsletter source="prompt-card" /></div>
    <JsonLd data={[articleJsonLd({ title: p.title, description: p.seo_description || p.excerpt, image: img, published: p.publish_at || p.created_at, modified: p.updated_at, author: p.author, path: `/prompt/${slug}` }), faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Prompts', path: '/prompts' }, { name: p.title, path: `/prompt/${slug}` }])]} />
  </div>);
}
