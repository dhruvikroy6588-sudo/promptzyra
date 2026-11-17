import Link from 'next/link';
import JsonLd from './JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';
export default function InfoPage({ title, path, updated = '17 November 2026', children, lead, extraJsonLd }) {
  return (<div className="wrap" style={{ paddingBottom: 64 }}>
    <nav className="crumbs"><Link href="/">Home</Link>/<span>{title}</span></nav>
    <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)' }}>{title}</h1>
    {lead && <p className="muted" style={{ fontSize: '1.1rem', maxWidth: 760 }}>{lead}</p>}
    <div className="prose">{children}</div>
    {updated && <p className="muted small" style={{ marginTop: 32 }}>Last updated: {updated}</p>}
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: title, path }]), ...(extraJsonLd ? [].concat(extraJsonLd) : [])]} />
  </div>);
}
