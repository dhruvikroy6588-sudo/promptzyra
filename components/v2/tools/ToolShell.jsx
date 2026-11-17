import Link from 'next/link';
import JsonLd from '../JsonLd';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
export default function ToolShell({ title, path, intro, children, faq = [], about }) {
  return (<div className="wrap" style={{ paddingBottom: 64 }}>
    <nav className="crumbs"><Link href="/">Home</Link>/<Link href="/tools">Free tools</Link>/<span>{title}</span></nav>
    <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{title}</h1><p className="muted prose">{intro}</p>
    {children}
    {about && <div className="prose" style={{ marginTop: 40 }}>{about}</div>}
    {faq.length > 0 && <div className="prose" style={{ marginTop: 24 }}><h2>FAQ</h2>{faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p style={{ margin: 0 }}>{f.a}</p></details>)}</div>}
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Free tools', path: '/tools' }, { name: title, path }]), faqJsonLd(faq), { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, url: `https://promptzyra.com${path}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]} />
  </div>);
}
