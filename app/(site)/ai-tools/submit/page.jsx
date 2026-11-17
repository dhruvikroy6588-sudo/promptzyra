import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { getCategories } from '@/lib/data';
import ToolSubmitForm from '@/components/v2/ToolSubmitForm';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
export const metadata = buildMetadata({ title: 'Submit an AI Tool', description: 'Suggest an AI tool for the Promptzyra directory. We review every submission by hand, and listings are never sold.', path: '/ai-tools/submit' });
export default async function Page() {
  const cats = await getCategories('tool');
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/ai-tools">AI Tools</Link>/<span>Submit a tool</span></nav>
      <div className="two">
        <div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Submit an AI tool</h1>
          <p className="muted prose">Know a useful AI tool that is missing from the directory, or built one yourself? Send it to us. A short description and the official website are enough to start.</p>
          <ToolSubmitForm cats={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
        </div>
        <aside className="panel td-how">
          <h2 style={{ fontSize: '1.15rem', marginTop: 0 }}>How we review</h2>
          <ul>
            <li>We open the official website and try the tool where we can.</li>
            <li>We write the guide ourselves: who it suits, how to start, strengths, limits and alternatives.</li>
            <li>Listings are editorial. We do not sell placements, and anything paid or affiliate will be labelled clearly.</li>
            <li>Submitting does not guarantee a listing, and we may not reply to every message.</li>
          </ul>
          <p className="muted small" style={{ marginBottom: 0 }}>Read our <Link href="/editorial-policy">editorial policy</Link> and <Link href="/privacy-policy">privacy policy</Link>. Your email is used only to contact you about this submission.</p>
        </aside>
      </div>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'AI Tools', path: '/ai-tools' }, { name: 'Submit a tool', path: '/ai-tools/submit' }])} />
    </div>
  );
}
