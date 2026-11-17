import ResumeEditor from '@/components/resume/ResumeEditor';
import { TEMPLATES } from '@/lib/resume/templates';
export const metadata = { title: 'Resume Editor', robots: { index: false, follow: true }, alternates: { canonical: 'https://promptzyra.com/resume-builder' } };
export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const t = TEMPLATES.find((x) => x.id === sp.template)?.id;
  return <ResumeEditor initialTemplate={t} />;
}
