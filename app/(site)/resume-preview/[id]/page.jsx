import { notFound } from 'next/navigation';
import ResumeView from '@/components/resume/ResumeView';
import { TEMPLATES } from '@/lib/resume/templates';
import { sampleResume } from '@/lib/resume/model';
export const metadata = { title: 'Template preview', robots: { index: false, follow: false } };
export default async function Page({ params }) {
  const { id } = await params; const t = TEMPLATES.find((x) => x.id === id);
  if (!t) notFound();
  const d = sampleResume();
  return <div style={{ display: 'grid', placeItems: 'center', padding: 12 }}><div id="shot"><ResumeView data={d} tpl={t} settings={{ paper: 'a4' }} /></div></div>;
}
