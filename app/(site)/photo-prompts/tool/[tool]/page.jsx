import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listPhotoPrompts } from '@/lib/data';
import PhotoList from '@/components/v2/PhotoList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
import { PHOTO_TOOLS, PHOTO_TOOL_INTRO, photoToolLabel } from '@/lib/photo';
export const dynamic = 'force-dynamic';
const valid = (t) => PHOTO_TOOLS.some((x) => x.id === t);
export async function generateMetadata({ params, searchParams }) {
  const { tool } = await params; const sp = await searchParams;
  if (!valid(tool)) return { title: 'Not found', robots: { index: false } };
  const l = photoToolLabel(tool);
  const top = await listPhotoPrompts({ tool, pageSize: 1 });
  return buildMetadata({ title: `${l} Photo Prompts for Your Own Photos`, description: `Photo prompts that work with ${l}. Upload your own picture, paste the prompt and get a styled AI image.`, path: `/photo-prompts/tool/${tool}`, noindex: !!(sp.q || sp.subject || sp.category || sp.sort) || parseInt(sp.page) > 1 || top.total === 0 });
}
export default async function Page({ params, searchParams }) {
  const { tool } = await params; const sp = await searchParams;
  if (!valid(tool)) notFound();
  const l = photoToolLabel(tool);
  const top = await listPhotoPrompts({ tool, pageSize: 12 });
  const faq = [
    { q: `How do I use a photo prompt in ${l}?`, a: `Open ${l}, attach your own photo, paste the prompt in the same message and send it. Then ask for small changes until you like the result.` },
    { q: 'Do prompts marked "Any AI tool" work here too?', a: `Yes. Prompts that are not tied to one tool are included on this page, but results can differ between tools, so expect to adjust the wording.` },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/photo-prompts">Photo Prompts</Link>/<span>{l}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>{l} photo prompts</h1>
      <div className="prose intro-long muted"><p>{PHOTO_TOOL_INTRO[tool]}</p><p>Tool features and limits change over time, so check {l}'s own help pages for what it currently supports with uploaded photos.</p></div></div>
    <PhotoList sp={sp} base={`/photo-prompts/tool/${tool}`} fixed={{ tool }} />
    <PromptFaq items={faq} title={`${l} photo prompts FAQ`} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Photo Prompts', path: '/photo-prompts' }, { name: l, path: `/photo-prompts/tool/${tool}` }]), top.rows.length ? itemListJsonLd(top.rows.map((p) => ({ name: p.title, path: `/photo-prompts/${p.slug}` }))) : null]} />
  </>);
}
