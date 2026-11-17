import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { getPhotoPrompt, getCategory, getCategories, relatedPhotoPrompts } from '@/lib/data';
import { abs } from '@/lib/site';
import { PHOTO_SAFETY, PHOTO_TOOLS, photoToolLabel, photoSubjectLabel } from '@/lib/photo';
import { PhotoCopyBox, CopyButton2, PhotoShare } from '@/components/v2/PhotoActions';
import { CardPhoto } from '@/components/v2/PhotoCards';
import PhotoPlaceholder from '@/components/v2/PhotoPlaceholder';
import JsonLd from '@/components/v2/JsonLd';
export const dynamic = 'force-dynamic';
const imgUrl = (u) => (u ? (u.startsWith('http') ? u : abs(u)) : undefined);
export async function generateMetadata({ params }) {
  const { slug } = await params; const p = await getPhotoPrompt(slug);
  if (!p) return { title: 'Not found', robots: { index: false } };
  return buildMetadata({ title: p.seo_title || `${p.title} - AI Photo Prompt`, description: p.seo_description || p.summary, path: `/photo-prompts/${slug}`, type: 'article', image: imgUrl(p.og_image) || imgUrl(p.image_url), modifiedTime: p.updated_at });
}
const STEPS = [
  ['Choose a clear reference image', 'Pick a sharp photo you own or have permission to use.'],
  ['Copy the master prompt', 'Use the copy button below, then paste it next to your photo.'],
  ['Generate, review and refine', 'Check the first result and ask for small changes.'],
  ['Check before publishing', 'Review rights, faces, hands and any text in the image.'],
];
const GENERIC_TIPS = [
  'Start with a sharp, well-lit photo where the face is clearly visible.',
  'Add a line asking the tool to keep your face, features and proportions the same.',
  'Change one detail at a time, such as lighting or background, so you can see what helped.',
];
export default async function Page({ params }) {
  const { slug } = await params;
  const p = await getPhotoPrompt(slug);
  if (!p) notFound();
  const [cat, related, cats] = await Promise.all([getCategory('photo', p.category), relatedPhotoPrompts(p, 6), getCategories('photo')]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const tl = photoToolLabel(p.tool);
  const tips = (p.tips || []).filter(Boolean);
  const tipList = tips.length ? tips : GENERIC_TIPS;
  const aspect = (String(p.style || '').match(/\b(\d{1,2}:\d{1,2})\b/) || [])[1];
  const format = aspect ? `${aspect} (customizable)` : '4:5 portrait (customizable)';
  const bestFor = (p.subject && p.subject !== 'other' ? photoSubjectLabel(p.subject) : '') || 'Personal photos';
  const nWords = (String(p.prompt).match(/\S+/g) || []).length + tipList.join(' ').split(/\s+/).length + 250;
  const readMin = Math.max(2, Math.ceil(nWords / 200));
  const updated = new Date(p.updated_at || p.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const faq = [
    { q: `Can I use this prompt with ${'ChatGPT'}?`, a: false ? '' : `Yes, it was written with ${tl} in mind. Other tools may work too, but results can differ.` },
    { q: 'Why does my result look different from the preview?', a: 'AI tools vary from run to run and depend on your reference photo, lighting and the tool version. Regenerate and adjust one detail at a time.' },
    { q: 'Can I use someone else\'s photo?', a: 'Only with their clear permission. Use photos you own or have the right to edit, and label AI-generated images as AI-generated.' },
    { q: 'Is it safe to upload my photo?', a: 'Read the AI tool\'s privacy settings first, and avoid photos that show sensitive background details.' },
  ];
  const tools = p.tool && p.tool !== 'any' ? [p.tool] : PHOTO_TOOLS.map((t) => t.id);
  const ld = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.summary, url: abs(`/photo-prompts/${slug}`), image: imgUrl(p.image_url), dateModified: p.updated_at, datePublished: p.publish_at || p.created_at, inLanguage: 'en', publisher: { '@type': 'Organization', name: 'Promptzyra' } };
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Photo Prompts', path: '/photo-prompts' }, ...(cat ? [{ name: cat.name, path: `/photo-prompts/category/${cat.slug}` }] : []), { name: p.title, path: `/photo-prompts/${slug}` }];
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <div className="ph2-layout">
        <article className="ph2-main">
          <Link href="/photo-prompts" className="ph2-back">&larr; Back to Photo Prompts</Link>
          <div className="ph-tags" style={{ margin: '14px 0 10px', alignItems: 'center' }}>{cat && <Link className="tag ac" href={`/photo-prompts/category/${cat.slug}`}>{cat.name}</Link>}<span className="muted small">{readMin} min read</span></div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4.5vw,2.8rem)' }}>{p.title}</h1>
          <p className="muted" style={{ fontSize: '1.08rem' }}>{p.summary}</p>
          <div className="ph2-author"><span className="small muted">Promptzyra Team · Creative prompt guide · Updated {updated}</span><PhotoShare slug={p.slug} title={p.title} /></div>

          <section id="overview" className="ph2-anchor" aria-label="Prompt overview">
            <div className="ph2-frame">
              {p.image_url ? <img src={p.image_url} alt={p.image_alt || `${p.title} - example AI photo result`} decoding="async" /> : <PhotoPlaceholder seed={p.category || p.subject || p.slug} label={`${p.title} cover`} />}
              <span className="ph2-badge">IMAGE PREVIEW</span>
            </div>
            <div className="ph2-tiles">
              <div><span className="ph-kicker">BEST FOR</span><b>{bestFor}</b></div>
              <div><span className="ph-kicker">TOOL</span><b>{tl}</b></div>
              <div><span className="ph-kicker">FORMAT</span><b>{format}</b></div>
            </div>
          </section>

          <section id="how-to" className="ph2-dark ph2-anchor"><h2>How to use this prompt</h2>
            <ol className="ph2-steps">{STEPS.map(([t, d], i) => <li key={t}><span className="ph2-num">{String(i + 1).padStart(2, '0')}</span><span><b>{t}</b><br /><span className="muted">{d}</span></span></li>)}</ol>
          </section>

          <section id="prompt" className="ph2-anchor"><h2>Copy-ready AI prompt</h2>
            <p className="muted">Paste this together with your own reference photo, then adjust the details in brackets or sentences to suit you.</p>
            {p.prompt ? <PhotoCopyBox prompt={p.prompt} slug={p.slug} /> : <div className="empty">The prompt text for this item is not available yet.</div>}
          </section>

          <section id="tips" className="ph2-anchor"><h2>Tips for a better result</h2>
            <ol className="ph2-tips">{tipList.map((t, i) => <li key={i}>{t}</li>)}</ol>
            <div className="ph2-dark"><h3>Suggested settings</h3><p className="muted small" style={{ marginTop: 0 }}>Starting points, not fixed requirements.</p>
              <table className="ph2-table"><tbody>
                <tr><th scope="row">Aspect ratio</th><td>{aspect || '4:5'} is a good start; change it to suit where you will use the image.</td></tr>
                <tr><th scope="row">Image style</th><td>{p.style || 'Follow the style described in the prompt, then adjust.'}</td></tr>
                <tr><th scope="row">Iteration tip</th><td>Change one detail per attempt so you can see what made the difference.</td></tr>
              </tbody></table></div>
          </section>

          <section className="ph2-dark ph2-faq" aria-label="FAQ"><h2>Frequently asked questions</h2>{faq.map((f, i) => <details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>

          {related.length > 0 && <section style={{ marginTop: 36 }}><h2>More photo prompts</h2><div className="ph-grid">{related.map((r) => <CardPhoto key={r.slug} p={r} catName={names[r.category]} />)}</div></section>}
          <div className="panel ph-safety" role="note" style={{ marginTop: 28 }}><h3>Use photos responsibly</h3><ul>{PHOTO_SAFETY.map((s) => <li key={s}>{s}</li>)}</ul></div>
        </article>

        <aside className="ph2-side">
          {p.prompt && <div className="ph2-make"><h3>Make it your own.</h3><p>Copy the prompt, add your own photo in {p.tool === 'any' ? 'your AI tool' : tl} and adjust the details.</p><CopyButton2 prompt={p.prompt} slug={p.slug} label="Copy prompt" className="btn btn-primary" /></div>}
          <nav className="panel ph2-toc" aria-label="In this guide"><span className="ph-kicker">IN THIS GUIDE</span>
            <a href="#overview">Prompt overview</a><a href="#how-to">How to use it</a><a href="#prompt">Copy-ready prompt</a><a href="#tips">Creator tips</a></nav>
          <div className="panel"><h3>Keep exploring</h3><p className="muted small">Browse more ready-made photo prompts{tools.length ? ` for ${tools.map(photoToolLabel).join(', ')}` : ''}.</p><Link className="btn btn-sm" href="/photo-prompts">All photo prompts</Link></div>
        </aside>
      </div>
      <JsonLd data={[ld, faqJsonLd(faq), breadcrumbJsonLd(crumbs)]} />
    </div>
  );
}
