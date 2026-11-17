import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { TEMPLATES, CATEGORIES } from '@/lib/resume/templates';
import Gallery from '@/components/resume/Gallery';
import JsonLd from '@/components/v2/JsonLd';
export const metadata = buildMetadata({ title: '100 Free Resume Templates — Modern, ATS-friendly & Creative', description: 'Browse 100 free resume templates in 8 styles: ATS-friendly, professional, modern, creative, simple, student, executive and tech. Click one to edit and download as PDF.', path: '/resume-templates' });
export default function Page() {
  return (<div className="wrap"><nav className="crumbs"><Link href="/">Home</Link>/<Link href="/resume-builder">Resume builder</Link>/<span>Templates</span></nav>
    <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>100 free resume templates</h1><p className="muted prose">Every template is fully editable. Click one to open it in the live editor with sample content you can replace.</p>
    <div className="chips" style={{ justifyContent: 'flex-start', margin: '16px 0 24px' }}>{CATEGORIES.map((c) => <Link key={c.slug} className="chip" href={`/resume-templates/${c.slug}`}>{c.name}</Link>)}</div>
    <Gallery list={TEMPLATES} /><div style={{ height: 56 }} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resume builder', path: '/resume-builder' }, { name: 'Templates', path: '/resume-templates' }]), itemListJsonLd(TEMPLATES.slice(0, 20).map((t) => ({ name: `${t.name} resume template`, path: '/resume-templates' })))]} /></div>);
}
