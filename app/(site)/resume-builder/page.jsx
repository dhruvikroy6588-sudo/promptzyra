import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, softwareJsonLd } from '@/lib/seo';
import { TEMPLATES, CATEGORIES } from '@/lib/resume/templates';
import Gallery from '@/components/resume/Gallery';
import JsonLd from '@/components/v2/JsonLd';
export const metadata = buildMetadata({ title: 'Free Resume Builder — 100 Templates, Live Editor, PDF Download', description: 'Build a resume online for free. Pick from 100 templates, type directly on the page, add or remove sections and download a clean text-based PDF with no watermark.', path: '/resume-builder' });
const FAQ = [
  { q: 'Is the resume builder really free?', a: 'Yes. All 100 templates, the editor and PDF download are free. There is no watermark and no account is needed.' },
  { q: 'Is my information uploaded anywhere?', a: 'No. Everything you type stays in your browser’s local storage. You can export a JSON backup and import it later.' },
  { q: 'Are the PDFs ATS-friendly?', a: 'The PDF contains real selectable text, not images. For the safest results with applicant tracking systems pick one of the ATS-friendly templates, which use a single column and standard headings.' },
  { q: 'How do I save as PDF?', a: 'Click Download PDF, choose “Save as PDF” as the destination in the print window and turn off “Headers and footers”. Choose the same paper size you selected in the editor.' },
  { q: 'Can I add or remove sections?', a: 'Yes. Hide, delete, rename or reorder any section and add new ones such as projects, certifications, awards, languages or a custom section.' },
];
export default function Page() {
  const featured = ['t001', 't014', 't027', 't040', 't052', 't066', 't078', 't090'].map((id) => TEMPLATES.find((t) => t.id === id));
  return (<div className="wrap">
    <section className="hero" style={{ paddingBottom: 24 }}>
      <h1>Free resume builder with <em>100 templates</em></h1>
      <p className="lead">Choose a design, click on the page and type. Add or remove sections, switch templates any time and download a clean PDF — no sign-up, no watermark.</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}><Link className="btn btn-primary" href="/resume-builder/editor">Start building</Link><Link className="btn" href="/resume-templates">Browse all 100 templates</Link></div>
    </section>
    <section className="sec" style={{ paddingTop: 16 }}><h2>Popular templates</h2><Gallery list={featured} /></section>
    <section className="sec"><h2>Templates by style</h2><div className="grid g4">{CATEGORIES.map((c) => <Link key={c.slug} href={`/resume-templates/${c.slug}`} className="card spot"><h3>{c.name}</h3><p>{c.blurb}</p><div className="ft"><span>{TEMPLATES.filter((t) => t.category === c.slug).length} templates</span><span>→</span></div></Link>)}</div></section>
    <section className="sec"><div className="prose"><h2>How to write a resume that gets read</h2>
      <ol><li><b>Start with the job post.</b> Copy the exact skill names it uses into your skills and experience bullets where they are true.</li><li><b>Lead with results.</b> Replace “responsible for” with what changed because of you: a number, a time saved, a decision improved.</li><li><b>Keep it to one page</b> unless you have more than ten years of relevant experience.</li><li><b>Use plain section titles</b> such as Experience, Education and Skills so software and people find them quickly.</li><li><b>Proofread out loud</b>, then ask one other person to read it.</li></ol>
      <p>Need help wording your bullets? Try the <Link href="/prompts/category/careers">career prompts</Link> or the <Link href="/ats-resume-checker">ATS resume checker</Link>.</p></div></section>
    <section className="sec"><h2>Resume builder FAQ</h2><div className="prose">{FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p style={{ margin: 0 }}>{f.a}</p></details>)}</div></section>
    <JsonLd data={[faqJsonLd(FAQ), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resume builder', path: '/resume-builder' }]), { ...softwareJsonLd({ name: 'Promptzyra Resume Builder', tagline: 'Free online resume builder with 100 templates', slug: '' }), url: 'https://promptzyra.com/resume-builder', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }]} />
  </div>);
}
