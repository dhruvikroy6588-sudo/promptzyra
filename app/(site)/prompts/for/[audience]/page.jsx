import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listPrompts, promptAudiences } from '@/lib/data';
import PromptList from '@/components/v2/PromptList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
async function resolve(slug) { const all = await promptAudiences(); return all.find((a) => a.slug === slug) || null; }
export async function generateMetadata({ params, searchParams }) {
  const { audience } = await params; const sp = await searchParams; const a = await resolve(audience);
  if (!a) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `AI Prompts for ${a.name}`, description: `Free, reviewed AI prompts made for ${a.name.toLowerCase()}. Copy, customize and use them with ChatGPT, Claude, Gemini and more.`, path: `/prompts/for/${audience}`, noindex: !!(sp.q || sp.model || sp.level || sp.sort || sp.type || sp.sub) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { audience } = await params; const sp = await searchParams; const a = await resolve(audience);
  if (!a) notFound();
  const top = await listPrompts({ audience: a.name, pageSize: 10 });
  const n = a.name.toLowerCase();
  const faq = [
    { q: `What kind of prompts are here for ${n}?`, a: `Prompts written with ${n} in mind: clear tasks, plain-language instructions and notes on what to check in the AI's answer.` },
    { q: 'Do I need an account?', a: 'No. Browse, copy and customize any prompt for free without signing up.' },
    { q: 'Can I trust the AI output?', a: 'Treat it as a draft. Check facts, numbers and sources before you use it for school, work or applications.' },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/prompts">Prompts</Link>/<span>For {a.name}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>AI prompts for {n}</h1>
      <div className="prose intro-long muted"><p>These prompts are chosen for {n}. Each is original, reviewed by hand and comes with guidance on when to use it, how to adapt it and what to verify before you rely on the answer.</p><p>Filter by AI model, level or prompt type to find what fits, then copy the prompt and customize the blanks.</p></div></div>
    <PromptList sp={sp} base={`/prompts/for/${audience}`} fixed={{ audience: a.name }} />
    <PromptFaq items={faq} title={`Prompts for ${n} — FAQ`} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Prompts', path: '/prompts' }, { name: `For ${a.name}`, path: `/prompts/for/${audience}` }]), itemListJsonLd(top.rows.map((r) => ({ name: r.title, path: `/prompts/${r.slug}` })))]} />
  </>);
}
