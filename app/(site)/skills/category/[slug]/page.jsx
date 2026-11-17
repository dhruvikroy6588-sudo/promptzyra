import { icon } from '@/lib/site';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { getCategory } from '@/lib/data';
import SkillList from '@/components/v2/SkillList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('skill', slug);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `${c.name} Skills for AI Assistants`, description: c.description || `Free SKILL.md packages for ${c.name.toLowerCase()}.`, path: `/skills/category/${slug}`, noindex: !!(sp.q || sp.level || sp.audience || sp.sort) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('skill', slug);
  if (!c) notFound();
  const n = c.name.toLowerCase();
  const faq = [
    { q: `What are ${n} skills?`, a: `They are SKILL.md packages that give an AI assistant reusable instructions for ${n}. Read the file, edit it if you like, then download or copy it into your tool.` },
    { q: 'How do I install one?', a: 'Open a skill and use the Install box: download the zip or copy SKILL.md, then follow the steps for Claude Code, Claude.ai or other chat tools.' },
    { q: 'Do I need to check the AI answer?', a: 'Yes. AI can make mistakes, so verify facts, numbers and sources before you use the result.' },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/skills">Skills</Link>/<span>{c.name}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{icon(c.icon)} {c.name} skills</h1><p className="muted prose">{c.description}</p>{c.intro && <div className="prose intro-long"><p>{c.intro}</p></div>}
      <div className="prose intro-long muted"><p>These {n} skills are original and reviewed by hand. Each one is a plain-text SKILL.md you can read, edit, download and install in your AI assistant.</p></div></div>
    <SkillList category={slug} sp={sp} base={`/skills/category/${slug}`} />
    <PromptFaq items={faq} title={`${c.name} skills: FAQ`} />
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Skills', path: '/skills' }, { name: c.name, path: `/skills/category/${slug}` }])} />
  </>);
}
