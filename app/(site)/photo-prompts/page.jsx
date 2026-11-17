import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listPhotoPrompts } from '@/lib/data';
import PhotoList from '@/components/v2/PhotoList';
import PromptFaq from '@/components/v2/PromptFaq';
import JsonLd from '@/components/v2/JsonLd';
import { PHOTO_FAQ } from '@/lib/photo';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const filtered = sp.q || sp.tool || sp.subject || sp.category || sp.sort;
  return buildMetadata({ title: 'AI Photo Prompts: Copy, Paste and Use With Your Own Photo', description: 'Ready-made prompts for Gemini, ChatGPT and Midjourney. Upload your own photo, paste a prompt and get a styled AI image. Free to copy.', path: '/photo-prompts', noindex: !!filtered || parseInt(sp.page) > 1 });
}
export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const top = await listPhotoPrompts({ pageSize: 12 });
  return (<>
    <div className="wrap"><h1 style={{ marginTop: 32, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>AI photo prompts</h1>
      <div className="prose intro-long muted">
        <p>Photo prompts are ready-made instructions you paste into an AI image tool together with your own picture. The tool restyles your photo: a cinematic portrait, a festive family scene, a cartoon of your pet. Each prompt here shows an example result, lists the tools it suits and gives tips for keeping your face and identity consistent.</p>
        <p>Browse by category, by AI tool or by who is in the photo. Copy a prompt, upload your own photo, and adjust the result with a few follow-up messages. Please read the safety notes on each page before you upload a picture.</p>
      </div></div>
    <PhotoList sp={sp} base="/photo-prompts" />
    <PromptFaq items={PHOTO_FAQ} title="Photo prompts FAQ" />
    <JsonLd data={[breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Photo Prompts', path: '/photo-prompts' }]), top.rows.length ? itemListJsonLd(top.rows.map((p) => ({ name: p.title, path: `/photo-prompts/${p.slug}` }))) : null]} />
  </>);
}
