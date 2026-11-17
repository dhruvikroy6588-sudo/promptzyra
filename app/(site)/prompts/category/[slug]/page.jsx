import { icon } from '@/lib/site';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { getCategory } from '@/lib/data';
import PromptList from '@/components/v2/PromptList';
import JsonLd from '@/components/v2/JsonLd';
import PromptFaq from '@/components/v2/PromptFaq';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('prompt', slug);
  if (!c) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `${c.name} AI Prompts`, description: c.description || `Reviewed AI prompts for ${c.name.toLowerCase()}.`, path: `/prompts/category/${slug}`, noindex: !!(sp.q || sp.model || sp.level || sp.sort || sp.type || sp.sub || sp.audience) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { slug } = await params; const sp = await searchParams;
  const c = await getCategory('prompt', slug);
  if (!c) notFound();
  const n = c.name.toLowerCase();
  const faq = [
    { q: `What are ${n} prompts?`, a: `They are ready-to-use instructions you give an AI assistant to get help with ${n}. Each one can be customized with your own details before you copy it.` },
    { q: `Which AI works best for ${n}?`, a: 'It depends on the task. Each prompt lists the models it suits, and you can filter the list by ChatGPT, Claude, Gemini and others.' },
    { q: 'Do I need to check the AI answer?', a: 'Yes. AI can make mistakes, so verify facts, numbers and sources before you use the result.' },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/prompts">Prompts</Link>/<span>{c.name}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{icon(c.icon)} {c.name} prompts</h1><p className="muted prose">{c.description}</p>{c.intro && <div className="prose intro-long"><p>{c.intro}</p></div>}<div className="prose intro-long muted"><p>These {c.name.toLowerCase()} prompts are original and reviewed by hand. Each one shows when to use it, how to adapt it and what to double-check in the AI's answer. Filter by model, audience or level to find the right fit.</p></div></div>
    <PromptList category={slug} sp={sp} base={`/prompts/category/${slug}`} />
    <PromptFaq items={faq} title={`${c.name} prompts — FAQ`} />
    <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Prompts', path: '/prompts' }, { name: c.name, path: `/prompts/category/${slug}` }])} />
  </>);
}
