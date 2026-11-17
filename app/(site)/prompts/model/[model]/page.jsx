import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listPrompts } from '@/lib/data';
import { MODELS } from '@/lib/site';
import PromptList from '@/components/v2/PromptList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
const find = (id) => MODELS.find((m) => m.id === id);
export async function generateMetadata({ params, searchParams }) {
  const { model } = await params; const sp = await searchParams; const m = find(model);
  if (!m) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `Best ${m.label} Prompts for Students, Teachers & Job Seekers`, description: `Free, reviewed ${m.label} prompts for studying, teaching, writing and careers. Copy, customize and use them in ${m.label} today.`, path: `/prompts/model/${model}`, noindex: !!(sp.q || sp.level || sp.sort || sp.type || sp.sub || sp.audience) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { model } = await params; const sp = await searchParams; const m = find(model);
  if (!m) notFound();
  const top = await listPrompts({ model, pageSize: 10 });
  const faq = [
    { q: `What can I do with ${m.label} prompts?`, a: `You can use them to study, plan lessons, write, prepare for interviews and save time on routine tasks in ${m.label}. Each prompt explains how to adapt it.` },
    { q: `Are these ${m.label} prompts free?`, a: 'Yes, every prompt on Promptzyra is free to copy and use. Some AI tools themselves may have paid plans, so check the tool’s own pricing page.' },
    { q: 'Will they work in other AI tools?', a: 'Often yes with small changes, but results differ between models, so test the prompt and check the answer.' },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/prompts">Prompts</Link>/<span>{m.label}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{m.label} prompts</h1>
      <div className="prose intro-long muted"><p>This page collects the Promptzyra prompts that suit {m.label}. Every prompt is original, reviewed by hand and written for education and everyday work, with notes on when to use it and what to verify in the answer.</p><p>Use the filters to narrow by level, audience or prompt type, then copy a prompt, fill in the blanks and paste it into {m.label}.</p></div></div>
    <PromptList sp={sp} base={`/prompts/model/${model}`} fixed={{ model }} />
    <PromptFaq items={faq} title={`${m.label} prompts — FAQ`} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Prompts', path: '/prompts' }, { name: m.label, path: `/prompts/model/${model}` }]), itemListJsonLd(top.rows.map((r) => ({ name: r.title, path: `/prompts/${r.slug}` })))]} />
  </>);
}
