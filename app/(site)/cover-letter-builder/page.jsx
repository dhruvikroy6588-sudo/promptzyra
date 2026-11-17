import { buildMetadata } from '@/lib/seo';
import ToolShell from '@/components/v2/tools/ToolShell';
import CoverLetter from '@/components/v2/tools/CoverLetter';
export const metadata = buildMetadata({ title: 'Free Cover Letter Builder — Write and Download as PDF', description: 'Answer a few questions and get a clean cover letter you can copy or save as PDF. Free, private and no sign-up.', path: '/cover-letter-builder' });
export default function Page() {
  return <ToolShell title="Cover letter builder" path="/cover-letter-builder" intro="Answer a few short questions and get a clean first draft. Then personalise it — recruiters can tell when a letter is generic." about={<><h2>Tips for a strong cover letter</h2><ul><li>Keep it under one page and about 200–300 words.</li><li>Name the company and the role, and say why you want that specific one.</li><li>Use one achievement with a number instead of a list of duties.</li><li>Read it aloud and remove anything that does not sound like you.</li></ul></>} faq={[{ q: 'Is my data saved?', a: 'No. The text stays in this page and disappears when you close it.' }, { q: 'How do I get a PDF?', a: 'Click “Save as PDF” and choose “Save as PDF” as the printer destination.' }]}><CoverLetter /></ToolShell>;
}
