import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { getComponent, relatedComponents, componentCounts } from '@/lib/data';
import { abs } from '@/lib/site';
import { COMPONENT_TYPES, COMPONENT_CAT_MAP, componentFiles } from '@/lib/components-meta';
import { kbLabel, byteLen, lineCount, safeFolder } from '@/lib/skill-md';
import SkillTabs from './SkillTabs';
import SkillCopy from './SkillCopy';
import CompInstall from './CompInstall';
import CompList from './CompList';
import CompCard from './CompCard';
import PromptFaq from './PromptFaq';
import JsonLd from './JsonLd';

export async function listMetadata(type, sp) {
  const m = COMPONENT_TYPES[type]; const filtered = sp.q || sp.category || sp.sort;
  return buildMetadata({ title: `${m.label} for AI Assistants: Free Examples & Downloads`, description: m.blurb, path: m.path, noindex: !!filtered || parseInt(sp.page) > 1 });
}
export async function ListPage({ type, searchParams }) {
  const sp = await searchParams; const m = COMPONENT_TYPES[type];
  const counts = await componentCounts(); const n = counts[type] || 0;
  const faq = [
    { q: `What are ${m.label.toLowerCase()}?`, a: m.blurb },
    { q: 'Are these free?', a: 'Yes. You can read, copy and download everything here for free and adapt it for study, teaching and personal projects.' },
    { q: 'Is it safe to use as is?', a: 'Read every file before you use it, especially anything that runs commands or connects to outside services. Entries link to their sources so you can check them yourself.' },
  ];
  return (<>
    <div className="wrap sk-hero">
      <h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{n > 0 ? `${n} ${m.label.toLowerCase()}` : m.label} for AI assistants</h1>
      <p className="muted prose">{m.blurb}</p>
    </div>
    <CompList type={type} meta={m} sp={sp} />
    <PromptFaq items={faq} title={`${m.label} FAQ`} />
    <JsonLd data={[faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: m.label, path: m.path }])]} />
  </>);
}
export async function detailMetadata(type, params) {
  const { slug } = await params; const c = await getComponent(type, slug); const m = COMPONENT_TYPES[type];
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: c.seo_title || `${c.name}: ${m.single} for AI Assistants`, description: c.seo_description || c.description, path: `${m.path}/${slug}`, type: 'article', image: c.og_image || undefined, modifiedTime: c.updated_at });
}
export async function DetailPage({ type, params }) {
  const { slug } = await params; const m = COMPONENT_TYPES[type];
  const c = await getComponent(type, slug); if (!c) notFound();
  const related = await relatedComponents(c, 3);
  const files = componentFiles(c).map((f) => ({ ...f, lines: lineCount(f.text), bytes: byteLen(f.text) }));
  const folder = safeFolder(c.slug);
  const useCases = (c.use_cases || []).filter(Boolean), prompts = (c.example_prompts || []).filter(Boolean), tags = (c.tags || []).filter(Boolean);
  const total = files.reduce((a, f) => a + f.bytes, 0);
  const faq = [
    { q: `What is ${/^[aeiou]/i.test(m.single) ? 'an' : 'a'} ${m.single.toLowerCase()}?`, a: m.blurb },
    { q: 'Is it safe to use?', a: 'Read the files first. Only use things you understand, and check the source page before you connect or run anything.' },
    { q: 'Can I change it?', a: 'Yes. Everything is plain text, so you can edit names, wording and settings to suit your own course or project.' },
  ];
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: c.name, description: c.description, url: abs(`${m.path}/${slug}`), inLanguage: 'en', dateModified: c.updated_at, datePublished: c.publish_at || c.created_at, keywords: tags.join(', ') || undefined, genre: COMPONENT_CAT_MAP[c.category], publisher: { '@type': 'Organization', name: 'Promptzyra' }, ...(c.github_url ? { isBasedOn: c.github_url } : {}) };
  const overview = (
    <div className="sk-overview">
      <section><h2 className="sk-h2">What it does</h2><p>{c.description}</p></section>
      {useCases.length > 0 && <section><h2 className="sk-h2">Use cases</h2><ul>{useCases.map((u, i) => <li key={i}>{u}</li>)}</ul></section>}
      {prompts.length > 0 && <section><h2 className="sk-h2">Example prompts</h2><div className="sk-prompts">{prompts.map((p, i) => <div key={i} className="sk-prompt"><p>{p}</p><SkillCopy text={p} label="Copy" /></div>)}</div></section>}
      <section><h2 className="sk-h2">FAQ</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: '8px 0 0' }}>{f.a}</p></details>)}</section>
      <p className="disclose">AI can make mistakes. Check facts and read every file before you use it. Updated {new Date(c.updated_at || c.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
    </div>
  );
  return (
    <div className="wrap sk-detail" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href={m.path}>{m.label.toLowerCase()}</Link>/<span>{c.name}</span></nav>
      <header className="sk-head"><div><h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.3rem)', margin: 0 }}>{c.name} <span className="sk-badge">{m.single}</span></h1><p className="muted" style={{ margin: '6px 0 0' }}>{c.description}</p></div></header>
      <div className="sk-grid">
        <div className="sk-main"><SkillTabs slug={c.slug} files={files.length ? files : [{ path: 'README.txt', text: 'No files yet. See the source link for details.', lines: 1, bytes: 45 }]} overview={overview} /></div>
        <aside className="sk-side">
          <CompInstall slug={c.slug} folder={folder} files={files.map(({ path, text }) => ({ path, text }))} install={c.install} github={c.github_url} />
          <section className="panel sk-about"><h2 className="sk-h2">About</h2>
            <dl className="sk-dl"><div><dt>Type</dt><dd>{m.single}</dd></div><div><dt>Author</dt><dd>{c.author}</dd></div><div><dt>Category</dt><dd>{COMPONENT_CAT_MAP[c.category] || '—'}</dd></div><div><dt>Level</dt><dd>{c.level}</dd></div><div><dt>Files</dt><dd>{files.length}</dd></div><div><dt>Size</dt><dd>{kbLabel(total)}</dd></div>{c.github_url && <div><dt>Source</dt><dd><a href={c.github_url} target="_blank" rel="noopener noreferrer nofollow">GitHub / docs</a></dd></div>}</dl>
            {tags.length > 0 && <div className="sk-tagrow">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
          </section>
        </aside>
      </div>
      {related.length > 0 && <section style={{ marginTop: 40 }}><h2>More {m.label.toLowerCase()}</h2><div className="pz-grid">{related.map((r) => <CompCard key={r.slug} c={r} base={m.path} />)}</div></section>}
      <JsonLd data={[ld, faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: m.label, path: m.path }, { name: c.name, path: `${m.path}/${slug}` }])]} />
    </div>
  );
}
