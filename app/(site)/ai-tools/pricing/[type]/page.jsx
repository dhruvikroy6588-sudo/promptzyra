import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listTools } from '@/lib/data';
import ToolList from '@/components/v2/ToolList';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
// NOTE: 'pricing' is a static segment, so a tool whose slug is exactly "pricing" would be shadowed at /ai-tools/pricing.
const TYPES = {
  free: { label: 'Free', h: 'Free AI tools', d: 'AI tools that are free to use. Some have usage limits, so check the official site for current terms.', intro: 'These tools do not require payment to get started. “Free” here is a general pricing type: limits, fair-use rules and features can change, so always confirm on the official site before relying on a tool for a project.' },
  freemium: { label: 'Freemium', h: 'Freemium AI tools', d: 'AI tools with a usable free plan and optional paid upgrades for more features or higher limits.', intro: 'Freemium tools let you start free and pay only if you need more power, such as higher limits, extra features or team use. It is a good way to test a tool on a real task before spending anything.' },
  'free-trial': { label: 'Free trial', h: 'AI tools with a free trial', d: 'AI tools that offer a time-limited or credit-limited free trial before a paid plan is needed.', intro: 'These tools are mainly paid but let you try them first. Trials change often and may need a card, so read the trial terms and set a reminder before it ends.' },
  paid: { label: 'Paid', h: 'Paid AI tools', d: 'Paid AI tools and subscriptions: guides on who they suit, strengths and limits.', intro: 'Paid tools can be worth it when they save real time, but compare alternatives first. Check the official pricing page for current plans, since prices and limits change.' },
  'open-source': { label: 'Open source', h: 'Open-source AI tools', d: 'Open-source AI tools you can inspect, run yourself and often use without a subscription.', intro: 'Open-source tools publish their code, so you can check how they work and often run them on your own computer. They may need more setup than hosted products. Download only from the official project page.' },
};
export async function generateMetadata({ params, searchParams }) {
  const { type } = await params; const sp = await searchParams; const t = TYPES[type];
  if (!t) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: `${t.h} — Guides & Alternatives`, description: t.d, path: `/ai-tools/pricing/${type}`, noindex: !!(sp.q || sp.sort || sp.platform) || parseInt(sp.page) > 1 });
}
export default async function Page({ params, searchParams }) {
  const { type } = await params; const sp = await searchParams; const t = TYPES[type];
  if (!t) notFound();
  const first = await listTools({ pricing: t.label, pageSize: 12 });
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/ai-tools">AI Tools</Link>/<span>{t.label}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{t.h}</h1><p className="muted prose">{t.intro}</p>
      <div className="chips" style={{ justifyContent: 'flex-start', marginTop: 12 }}>{Object.entries(TYPES).map(([k, v]) => <Link key={k} href={`/ai-tools/pricing/${k}`} className={`chip${k === type ? ' on' : ''}`}>{v.label}</Link>)}</div></div>
    <ToolList sp={sp} base={`/ai-tools/pricing/${type}`} fixedPricing={t.label} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Tools', path: '/ai-tools' }, { name: t.label, path: `/ai-tools/pricing/${type}` }]), first.rows.length ? itemListJsonLd(first.rows.map((x) => ({ name: x.name, path: `/ai-tools/${x.slug}` }))) : null]} />
  </>);
}
