import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { buildMetadata, breadcrumbJsonLd, softwareJsonLd, faqJsonLd } from '@/lib/seo';
import { getTool, getCategory, relatedTools, toolsBySlugs, getCategories } from '@/lib/data';
import { ToolCard } from '@/components/v2/Cards';
import ToolLogo from '@/components/v2/ToolLogo';
import ShareButton from '@/components/v2/ShareButton';
import JsonLd from '@/components/v2/JsonLd';
import FavButton from '@/components/v2/FavButton';
import { abs } from '@/lib/site';
export const dynamic = 'force-dynamic';
const arr = (v) => (Array.isArray(v) ? v.map((x) => String(x || '').trim()).filter(Boolean) : []);
const fmt = (d) => { try { const x = new Date(d); return isNaN(x) ? '' : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } };
export async function generateMetadata({ params }) {
  const { slug } = await params; const t = await getTool(slug);
  if (!t) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: t.seo_title || `${t.name} — What It Is, Features, Pricing & Alternatives`, description: t.seo_description || t.tagline, path: `/ai-tools/${slug}`, type: 'article', image: t.og_image ? (/^https?:\/\//.test(t.og_image) ? t.og_image : abs(t.og_image)) : undefined, modifiedTime: t.updated_at });
}
export default async function Page({ params }) {
  const { slug } = await params;
  const t = await getTool(slug);
  if (!t) notFound();
  const [cat, related, alts, cats] = await Promise.all([getCategory('tool', t.category), relatedTools(t, 6), toolsBySlugs(arr(t.alternatives)), getCategories('tool')]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const safeUrl = /^https?:\/\//i.test(t.website_url || '') ? t.website_url : '';
  const paras = String(t.description || '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  const steps = arr(t.use_steps), features = arr(t.features), useCases = arr(t.use_cases), pros = arr(t.pros), cons = arr(t.cons), tags = arr(t.tags), platforms = arr(t.platforms);
  const faq = (Array.isArray(t.faq) ? t.faq : []).map((f) => ({ q: String(f?.q || '').trim(), a: String(f?.a || '').trim() })).filter((f) => f.q && f.a);
  const altSlugs = new Set(alts.map((a) => a.slug));
  const more = related.filter((r) => !altSlugs.has(r.slug)).slice(0, 4);
  const added = fmt(t.publish_at || t.created_at), checked = t.last_checked ? fmt(t.last_checked) : '';
  const hasPricing = !!(t.pricing || t.pricing_details);
  const sections = [
    paras.length || t.best_for ? ['overview', 'Overview'] : null,
    steps.length ? ['how-to-use', 'How to use'] : null,
    features.length ? ['features', 'Core features'] : null,
    useCases.length ? ['use-cases', 'Use cases'] : null,
    pros.length || cons.length ? ['pros-cons', 'Advantages & limits'] : null,
    hasPricing ? ['pricing', 'Pricing'] : null,
    faq.length ? ['faq', 'FAQ'] : null,
    alts.length ? ['alternatives', 'Alternatives'] : null,
  ].filter(Boolean);
  const free = t.pricing === 'Free' || t.pricing === 'Open source';
  const ld = { ...softwareJsonLd(t), ...(platforms.length ? { operatingSystem: platforms.join(', ') } : {}), ...(t.screenshot_url ? { screenshot: t.screenshot_url } : {}), ...(free ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } : {}) };
  return (
    <div className="wrap td" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/ai-tools">AI Tools</Link>/{cat ? <><Link href={`/ai-tools/category/${cat.slug}`}>{cat.name}</Link>/</> : null}<span>{t.name}</span></nav>

      <header className="panel td-head">
        <ToolLogo tool={t} size={72} className="td-logo" />
        <div className="td-id">
          <h1>{t.name}</h1>
          {t.tagline && <p className="td-tag">{t.tagline}</p>}
          <div className="td-chips">
            {t.pricing && <Link className="tag ac" href={`/ai-tools?pricing=${encodeURIComponent(t.pricing)}`}>{t.pricing}</Link>}
            {platforms.map((p) => <span key={p} className="tag">{p}</span>)}
            {cat && <Link className="tag" href={`/ai-tools/category/${cat.slug}`}>{cat.name}</Link>}
          </div>
          {(added || checked) && <p className="td-dates muted small">{added && <span>Added {added}</span>}{added && checked && ' · '}{checked && <span>Last checked {checked}</span>}</p>}
          {tags.length > 0 && <div className="td-chips td-tags">{tags.slice(0, 8).map((x) => <span key={x} className="tag">#{x}</span>)}</div>}
          <div className="td-actions">
            {safeUrl && <a className="btn btn-primary" href={safeUrl} target="_blank" rel="nofollow noopener noreferrer">Visit website<ExternalLink size={15} aria-hidden="true" /></a>}
            <FavButton kind="tool" slug={t.slug} />
            <ShareButton title={`${t.name} — AI tool guide`} path={`/ai-tools/${t.slug}`} />
          </div>
        </div>
      </header>

      {t.screenshot_url && /^(https?:)?\/\//.test(t.screenshot_url) && <figure className="td-shot"><div className="td-shot-bar" aria-hidden="true"><i /><i /><i /></div><img src={t.screenshot_url} alt={`${t.name} screenshot`} loading="lazy" decoding="async" referrerPolicy="no-referrer" /></figure>}

      {sections.length > 1 && <nav className="td-nav" aria-label="On this page">{sections.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>}

      <div className="two td-grid">
        <article className="td-main">
          {sections.some(([id]) => id === 'overview') && <section id="overview" className="td-sec"><h2>Overview of {t.name}</h2><div className="prose">{paras.map((para, i) => <p key={i}>{para}</p>)}{t.best_for && <p><b>Best for:</b> {t.best_for}</p>}</div></section>}

          {steps.length > 0 && <section id="how-to-use" className="td-sec"><h2>How to use {t.name}</h2>{t.how_to_use_intro && <p className="muted">{t.how_to_use_intro}</p>}<ol className="td-steps">{steps.map((s, i) => <li key={i}><span className="td-step-n" aria-hidden="true">{i + 1}</span><span>{s}</span></li>)}</ol></section>}

          {features.length > 0 && <section id="features" className="td-sec"><h2>Core features</h2><ul className="td-feat">{features.map((f, i) => <li key={i}><Check size={16} aria-hidden="true" /><span>{f}</span></li>)}</ul></section>}

          {useCases.length > 0 && <section id="use-cases" className="td-sec"><h2>Use cases</h2><div className="td-uc">{useCases.map((u, i) => <div key={i} className="td-uc-i">{u}</div>)}</div></section>}

          {(pros.length > 0 || cons.length > 0) && <section id="pros-cons" className="td-sec"><h2>Advantages &amp; limits</h2><div className="pc">{pros.length > 0 && <div className="panel pros"><h3>Advantages</h3><ul>{pros.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}{cons.length > 0 && <div className="panel cons"><h3>Limits to know</h3><ul>{cons.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}</div></section>}

          {hasPricing && <section id="pricing" className="td-sec"><h2>{t.name} pricing</h2><div className="panel">{t.pricing && <p style={{ margin: '0 0 8px' }}><span className="muted small">Pricing type</span><br /><b>{t.pricing}</b></p>}{t.pricing_details && <div className="prose">{String(t.pricing_details).split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}<p className="td-note"><AlertTriangle size={14} aria-hidden="true" /> Prices and limits change often. Verify the current plans on the {safeUrl ? <a href={safeUrl} target="_blank" rel="nofollow noopener noreferrer">official site</a> : 'official site'} before you pay.</p></div></section>}

          {faq.length > 0 && <section id="faq" className="td-sec faq-box" style={{ marginTop: 0 }}><h2>Frequently asked questions</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: '8px 0 0' }}>{f.a}</p></details>)}</section>}

          {alts.length > 0 && <section id="alternatives" className="td-sec"><h2>{t.name} alternatives</h2><div className="grid g2">{alts.map((a) => <ToolCard key={a.slug} t={a} catName={names[a.category]} />)}</div></section>}

          <p className="disclose" style={{ marginTop: 24 }}>Pricing and features change often. {checked ? `We last reviewed this page on ${checked}. ` : ''}Always confirm current details on the official website. Promptzyra is not affiliated with {t.name} unless stated. <Link href="/editorial-policy">How we write these guides</Link>.</p>
        </article>
        <aside className="td-side">
          <div className="panel"><h3>Quick facts</h3><dl className="td-facts">
            {t.pricing && <div><dt>Pricing type</dt><dd>{t.pricing}</dd></div>}
            {cat && <div><dt>Category</dt><dd><Link href={`/ai-tools/category/${cat.slug}`}>{cat.name}</Link></dd></div>}
            {platforms.length > 0 && <div><dt>Platforms</dt><dd>{platforms.join(', ')}</dd></div>}
            {t.best_for && <div><dt>Best for</dt><dd>{t.best_for}</dd></div>}
            {checked && <div><dt>Last checked</dt><dd>{checked}</dd></div>}
          </dl>{safeUrl && <a className="btn btn-primary" style={{ marginTop: 14, width: '100%' }} href={safeUrl} target="_blank" rel="nofollow noopener noreferrer">Visit website<ExternalLink size={15} aria-hidden="true" /></a>}</div>
          <div className="panel spot"><h3>Prompts for this task</h3><p className="muted small">Copy a tested prompt and try it in any AI assistant.</p><Link className="btn btn-sm" href="/prompts">Browse prompts</Link></div>
          <div className="panel"><p className="small" style={{ margin: '0 0 8px' }}>Spot a mistake? <Link href="/contact">Tell us</Link> and we will fix it.</p><p className="small" style={{ margin: 0 }}>Built something or know a great tool? <Link href="/ai-tools/submit">Submit your tool</Link>.</p></div>
        </aside>
      </div>
      {more.length > 0 && <section className="td-sec" style={{ marginTop: 40 }}><h2>More {cat?.name || ''} tools</h2><div className="grid g2 td-more">{more.map((r) => <ToolCard key={r.slug} t={r} catName={names[r.category]} />)}</div></section>}
      <JsonLd data={[ld, faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Tools', path: '/ai-tools' }, ...(cat ? [{ name: cat.name, path: `/ai-tools/category/${cat.slug}` }] : []), { name: t.name, path: `/ai-tools/${slug}` }])]} />
    </div>
  );
}
