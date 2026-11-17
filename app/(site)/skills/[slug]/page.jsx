import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { getSkill, getCategory, getCategories, relatedSkills } from '@/lib/data';
import { abs } from '@/lib/site';
import { skillFiles, kbLabel, safeFolder } from '@/lib/skill-md';
import SkillTabs from '@/components/v2/SkillTabs';
import SkillInstall from '@/components/v2/SkillInstall';
import SkillSave from '@/components/v2/SkillSave';
import SkillCopy from '@/components/v2/SkillCopy';
import SkillCard from '@/components/v2/SkillCard';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params; const s = await getSkill(slug);
  if (!s) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: s.seo_title || `${s.name}: AI Skill (SKILL.md)`, description: s.seo_description || s.description, path: `/skills/${slug}`, type: 'article', image: s.og_image || undefined, modifiedTime: s.updated_at });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const s = await getSkill(slug);
  if (!s) notFound();
  const [cat, related, cats] = await Promise.all([getCategory('skill', s.category), relatedSkills(s, 3), getCategories('skill')]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const files = skillFiles(s);
  const folder = safeFolder(s.slug);
  const totalBytes = files.reduce((a, f) => a + f.bytes, 0);
  const useCases = (s.use_cases || []).filter(Boolean);
  const prompts = (s.example_prompts || []).filter(Boolean);
  const tags = (s.tags || []).filter(Boolean);
  const faq = [
    { q: 'What is a skill?', a: 'A skill is a folder with a SKILL.md file of plain-text instructions that an AI assistant can follow for a specific kind of task.' },
    { q: 'How do I install this skill?', a: `Download the zip or copy SKILL.md. In Claude Code, put the ${folder} folder in ~/.claude/skills/ or in .claude/skills/ inside your project. In Claude.ai, upload the zip where your plan allows custom skills. In other chat tools, paste SKILL.md as the instructions.` },
    { q: 'Can I edit it before using it?', a: 'Yes. It is plain text, so you can change the wording, level or examples to suit your needs. Check AI answers before you rely on them.' },
  ];
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: s.name, description: s.description, url: abs(`/skills/${slug}`), inLanguage: 'en', dateModified: s.updated_at, datePublished: s.publish_at || s.created_at, keywords: tags.join(', ') || undefined, genre: cat?.name, audience: s.audience ? { '@type': 'Audience', audienceType: s.audience } : undefined, educationalLevel: s.level || undefined, encodingFormat: 'text/markdown', publisher: { '@type': 'Organization', name: 'Promptzyra' } };
  const overview = (
    <div className="sk-overview">
      <section><h2 className="sk-h2">What this skill does</h2><p>{s.description}</p></section>
      {useCases.length > 0 && <section><h2 className="sk-h2">Use cases</h2><ul>{useCases.map((u, i) => <li key={i}>{u}</li>)}</ul></section>}
      {prompts.length > 0 && <section><h2 className="sk-h2">Example prompts</h2><p className="muted small">Try these once the skill is installed.</p><div className="sk-prompts">{prompts.map((p, i) => <div key={i} className="sk-prompt"><p>{p}</p><SkillCopy text={p} label="Copy" /></div>)}</div></section>}
      <section><h2 className="sk-h2">FAQ</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: '8px 0 0' }}>{f.a}</p></details>)}</section>
      <p className="disclose">AI can make mistakes. Check facts, numbers and sources before you rely on or submit any output. Updated {new Date(s.updated_at || s.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
    </div>
  );
  return (
    <div className="wrap sk-detail" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/skills">skills</Link>/{cat ? <Link href={`/skills/category/${cat.slug}`}>{cat.name.toLowerCase()}</Link> : <span>skill</span>}/<span>{s.name}</span></nav>
      <header className="sk-head">
        <div><h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.3rem)', margin: 0 }}>{s.name} <span className="sk-badge">Skill</span></h1><p className="muted" style={{ margin: '6px 0 0' }}>{s.description}</p></div>
        <SkillSave slug={s.slug} withLabel />
      </header>
      <div className="sk-grid">
        <div className="sk-main"><SkillTabs slug={s.slug} files={files.map(({ path, text, lines, bytes }) => ({ path, text, lines, bytes }))} overview={overview} /></div>
        <aside className="sk-side">
          <SkillInstall slug={s.slug} folder={folder} files={files.map(({ path, text }) => ({ path, text }))} />
          <section className="panel sk-about"><h2 className="sk-h2">About</h2>
            <p className="small" style={{ margin: '0 0 10px' }}>{s.description}</p>
            <dl className="sk-dl"><div><dt>Category</dt><dd>{cat ? <Link href={`/skills/category/${cat.slug}`}>{cat.name}</Link> : '—'}</dd></div><div><dt>Audience</dt><dd>{s.audience}</dd></div><div><dt>Level</dt><dd>{s.level}</dd></div><div><dt>Files</dt><dd>{files.length}</dd></div><div><dt>Size</dt><dd>{kbLabel(totalBytes)}</dd></div>{s.copy_count > 0 && <div><dt>Copies</dt><dd>{s.copy_count}</dd></div>}</dl>
            {tags.length > 0 && <div className="sk-tagrow">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
          </section>
        </aside>
      </div>
      {related.length > 0 && <section style={{ marginTop: 40 }}><h2>More {cat?.name || ''} skills</h2><div className="pz-grid">{related.map((r) => <SkillCard key={r.slug} s={r} catName={names[r.category]} />)}</div></section>}
      <JsonLd data={[ld, faqJsonLd(faq), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Skills', path: '/skills' }, ...(cat ? [{ name: cat.name, path: `/skills/category/${cat.slug}` }] : []), { name: s.name, path: `/skills/${slug}` }])]} />
    </div>
  );
}
