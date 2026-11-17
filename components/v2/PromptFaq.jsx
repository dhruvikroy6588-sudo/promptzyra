import JsonLd from './JsonLd';
import { faqJsonLd } from '@/lib/seo';
export default function PromptFaq({ items, title = 'Frequently asked questions' }) {
  if (!items?.length) return null;
  return (<section className="wrap faq-box" aria-label={title}><h2>{title}</h2>{items.map((f, i) => <details key={i}><summary>{f.q}</summary><p style={{ margin: '8px 0 0' }}>{f.a}</p></details>)}<JsonLd data={faqJsonLd(items)} /></section>);
}
