import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listPhotoPrompts } from '@/lib/data';
import PhotoList from '@/components/v2/PhotoList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
import { PHOTO_SUBJECTS } from '@/lib/photo';
export const dynamic = 'force-dynamic';
const find = (id) => PHOTO_SUBJECTS.find((s) => s.id === id) || null;
export async function generateMetadata({ params, searchParams }) {
  const { subject } = await params; const sp = await searchParams; const s = find(subject);
  if (!s) return { title: 'Not found', robots: { index: false } };
  const top = await listPhotoPrompts({ subject, pageSize: 1 });
  return buildMetadata({ title: `AI Photo Prompts for ${s.label}`, description: s.intro.slice(0, 165), path: `/photo-prompts/for/${subject}`, noindex: !!(sp.q || sp.tool || sp.category || sp.sort) || parseInt(sp.page) > 1 || top.total === 0 });
}
export default async function Page({ params, searchParams }) {
  const { subject } = await params; const sp = await searchParams; const s = find(subject);
  if (!s) notFound();
  const top = await listPhotoPrompts({ subject, pageSize: 12 });
  const faq = [
    { q: `Which photo should I upload for ${s.label.toLowerCase()} prompts?`, a: 'A sharp, well-lit photo where the face or subject is clearly visible works best. Only upload photos you own or have permission to use.' },
    { q: 'How do I keep the result looking like the original?', a: 'Add a line such as "keep the face, features and proportions exactly the same" to the prompt and regenerate if the first result drifts.' },
  ];
  return (<>
    <div className="wrap"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>/<Link href="/photo-prompts">Photo Prompts</Link>/<span>{s.label}</span></nav>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>AI photo prompts for {s.label.toLowerCase()}</h1>
      <div className="prose intro-long muted"><p>{s.intro}</p></div></div>
    <PhotoList sp={sp} base={`/photo-prompts/for/${subject}`} fixed={{ subject }} />
    <PromptFaq items={faq} title={`${s.label} photo prompts FAQ`} />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Photo Prompts', path: '/photo-prompts' }, { name: s.label, path: `/photo-prompts/for/${subject}` }]), top.rows.length ? itemListJsonLd(top.rows.map((p) => ({ name: p.title, path: `/photo-prompts/${p.slug}` }))) : null]} />
  </>);
}
