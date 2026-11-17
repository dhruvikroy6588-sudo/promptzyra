import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { getPrompt, getCategory, relatedPrompts, getCategories, toolsBySlugs } from '@/lib/data';
import { modelLabel, abs } from '@/lib/site';
import PromptCustomizer from '@/components/v2/PromptCustomizer';
import { PromptCard, ToolCard } from '@/components/v2/Cards';
import JsonLd from '@/components/v2/JsonLd';
import FavButton from '@/components/v2/FavButton';
import { ShareButton } from '@/components/v2/PhotoCards';
import ImageLightbox from '@/components/v2/ImageLightbox';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params; const p = await getPrompt(slug);
  if (!p) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: p.seo_title || `${p.title} — AI Prompt`, description: p.seo_description || p.summary, path: `/prompts/${slug}`, type: 'article', image: p.og_image || undefined, modifiedTime: p.updated_at });
}
const List = ({ items }) => items?.length ? <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul> : null;
export default async function Page({ params }) {
  const { slug } = await params;
  const p = await getPrompt(slug);
  if (!p) notFound();
  const [cat, related, cats, tools] = await Promise.all([getCategory('prompt', p.category), relatedPrompts(p, 4), getCategories('prompt'), toolsBySlugs(p.related_tools || [])]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const faq = (p.faq || []).filter((f) => f?.q && f?.a);
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.summary, url: abs(`/prompts/${slug}`), dateModified: p.updated_at, datePublished: p.publish_at || p.created_at, inLanguage: 'en', publisher: { '@type': 'Organization', name: 'Promptzyra' } };
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/prompts">Prompts</Link>/{cat && <><Link href={`/prompts/category/${cat.slug}`}>{cat.name}</Link>/</>}<span>{p.title}</span></nav>
      <div className="two">
        <article>
          <h1 style={{ fontSize: 'clamp(1.7rem,4vw,2.5rem)' }}>{p.title}</h1>
          <p className="muted" style={{ fontSize: '1.05rem' }}>{p.summary}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>{p.type === 'image' && <span className="tag">Image prompt</span>}{p.level && <span className="tag">{p.level}</span>}{p.audience && <span className="tag">For {p.audience}</span>}{(p.models || []).map((m) => <span key={m} className="tag ac">{modelLabel(m)}</span>)}</div>
          {p.type === 'image' && p.example_image_url && <ImageLightbox src={p.example_image_url} alt={`Example result for ${p.title}`} caption="Example result — click to enlarge" />}
          {p.example_image_url && p.type !== 'image' && <figure style={{ margin: '0 0 18px' }}><img className="example-img" src={p.example_image_url} alt={`Example result for ${p.title}`} loading="lazy" /><figcaption className="muted small">Example result</figcaption></figure>}
          <PromptCustomizer prompt={p.prompt} slug={p.slug} extra={<><FavButton kind="prompt" slug={p.slug} /><ShareButton title={p.title} path={`/prompts/${p.slug}`} /></>} />
          <div className="prose">
            {p.when_to_use && <><h2>When to use it</h2><p>{p.when_to_use}</p></>}
            {p.how_to_use && <><h2>How to use this prompt</h2><ol>{p.how_to_use.split('\n').filter(Boolean).map((s, i) => <li key={i}>{s.replace(/^\d+[.)]\s*/, '')}</li>)}</ol></>}
            {p.example_output && <><h2>What good output looks like</h2><div className="pre">{p.example_output}</div></>}
            {p.tips?.length > 0 && <><h2>Tips to get better results</h2><List items={p.tips} /></>}
            {faq.length > 0 && <><h2>FAQ</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: 0 }}>{f.a}</p></details>)}</>}
          </div>
          <p className="disclose" style={{ marginTop: 24 }}>AI can make mistakes. Check facts, numbers and sources before you rely on or submit any output. Updated {new Date(p.updated_at || p.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
        </article>
        <aside style={{ display: 'grid', gap: 14 }}>
          <div className="panel"><h3>Related AI tools</h3>{tools.length ? <div className="grid">{tools.map((t) => <ToolCard key={t.slug} t={t} />)}</div> : <p className="muted small">Browse the <Link href="/ai-tools">AI tools directory</Link> to find a tool for this task.</p>}</div>
          <div className="panel spot"><h3>Need a resume too?</h3><p className="muted small">Build and download it free in your browser.</p><Link className="btn btn-primary btn-sm" href="/resume-builder">Open resume builder</Link></div>
        </aside>
      </div>
      {related.length > 0 && <section style={{ marginTop: 40 }}><h2>More {cat?.name || ''} prompts</h2><div className="grid g2">{related.map((r) => <PromptCard key={r.slug} p={r} catName={names[r.category]} />)}</div></section>}
      <JsonLd data={[ld, faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Prompts', path: '/prompts' }, ...(cat ? [{ name: cat.name, path: `/prompts/category/${cat.slug}` }] : []), { name: p.title, path: `/prompts/${slug}` }])]} />
    </div>
  );
}
