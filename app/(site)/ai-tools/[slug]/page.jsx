import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, softwareJsonLd } from '@/lib/seo';
import { getTool, getCategory, relatedTools, toolsBySlugs, getCategories } from '@/lib/data';
import { ToolCard } from '@/components/v2/Cards';
import JsonLd from '@/components/v2/JsonLd';
import FavButton from '@/components/v2/FavButton';
import { abs } from '@/lib/site';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params; const t = await getTool(slug);
  if (!t) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: t.seo_title || `${t.name} — What It Is, Pricing Type & Alternatives`, description: t.seo_description || t.tagline, path: `/ai-tools/${slug}`, type: 'article', image: t.og_image ? (/^https?:\/\//.test(t.og_image) ? t.og_image : abs(t.og_image)) : undefined, modifiedTime: t.updated_at });
}
export default async function Page({ params }) {
  const { slug } = await params;
  const t = await getTool(slug);
  if (!t) notFound();
  const [cat, related, alts, cats] = await Promise.all([getCategory('tool', t.category), relatedTools(t, 4), toolsBySlugs(t.alternatives || []), getCategories('tool')]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const safeUrl = /^https?:\/\//.test(t.website_url || '') ? t.website_url : '';
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/ai-tools">AI Tools</Link>/{cat && <><Link href={`/ai-tools/category/${cat.slug}`}>{cat.name}</Link>/</>}<span>{t.name}</span></nav>
      <div className="two">
        <article>
          <div className="pz-titlerow"><h1 style={{ fontSize: 'clamp(1.7rem,4vw,2.5rem)' }}>{t.name}</h1><FavButton kind="tool" slug={t.slug} /></div>
          <p className="muted" style={{ fontSize: '1.05rem' }}>{t.tagline}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>{t.pricing && <span className="tag ac">{t.pricing}</span>}{(t.platforms || []).map((p) => <span key={p} className="tag">{p}</span>)}{(t.tags || []).slice(0, 4).map((p) => <span key={p} className="tag">{p}</span>)}</div>
          <div className="prose">
            {t.description && t.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
            {t.best_for && <><h2>Best for</h2><p>{t.best_for}</p></>}
            {t.use_steps?.length > 0 && <><h2>How to get started</h2><ol>{t.use_steps.map((s, i) => <li key={i}>{s}</li>)}</ol></>}
          </div>
          {(t.pros?.length > 0 || t.cons?.length > 0) && <div className="pc" style={{ margin: '20px 0' }}><div className="panel pros"><h4>Strengths</h4><ul>{(t.pros || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div><div className="panel cons"><h4>Limits to know</h4><ul>{(t.cons || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div></div>}
          {alts.length > 0 && <section><h2>Alternatives</h2><div className="grid g2">{alts.map((a) => <ToolCard key={a.slug} t={a} catName={names[a.category]} />)}</div></section>}
          <p className="disclose" style={{ marginTop: 24 }}>Pricing and features change often. {t.last_checked ? `We last reviewed this page on ${new Date(t.last_checked).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}. ` : ''}Always confirm current details on the official website. Promptzyra is not affiliated with {t.name} unless stated.</p>
        </article>
        <aside style={{ display: 'grid', gap: 14 }}>
          <div className="panel"><h3>Quick facts</h3><dl style={{ margin: 0, display: 'grid', gap: 8 }}><div><dt className="muted small">Pricing type</dt><dd style={{ margin: 0 }}>{t.pricing}</dd></div>{cat && <div><dt className="muted small">Category</dt><dd style={{ margin: 0 }}><Link href={`/ai-tools/category/${cat.slug}`}>{cat.name}</Link></dd></div>}</dl>{safeUrl && <a className="btn btn-primary" style={{ marginTop: 14 }} href={safeUrl} target="_blank" rel="noopener noreferrer nofollow">Visit official site ↗</a>}</div>
          <div className="panel spot"><h3>Prompts for this task</h3><p className="muted small">Copy a tested prompt and try it in any AI assistant.</p><Link className="btn btn-sm" href="/prompts">Browse prompts</Link></div>
        </aside>
      </div>
      {related.length > 0 && <section style={{ marginTop: 40 }}><h2>More {cat?.name || ''} tools</h2><div className="grid g2">{related.map((r) => <ToolCard key={r.slug} t={r} catName={names[r.category]} />)}</div></section>}
      <JsonLd data={[softwareJsonLd(t), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Tools', path: '/ai-tools' }, ...(cat ? [{ name: cat.name, path: `/ai-tools/category/${cat.slug}` }] : []), { name: t.name, path: `/ai-tools/${slug}` }])]} />
    </div>
  );
}
