import { buildMetadata } from '@/lib/seo';
import ToolShell from '@/components/v2/tools/ToolShell';
import AtsChecker from '@/components/v2/tools/AtsChecker';
export const metadata = buildMetadata({ title: 'Free ATS Resume Checker — Keyword & Format Check', description: 'Paste your resume and a job description to check basic ATS-friendliness and keyword gaps. Private: runs entirely in your browser.', path: '/ats-resume-checker' });
export default function Page() {
  return <ToolShell title="ATS resume checker" path="/ats-resume-checker" intro="Check that your resume has the basics applicant tracking systems look for, and compare it with a job description to spot missing keywords." about={<><h2>What this checks</h2><p>Contact details, standard section headings, measurable results, length and symbols that confuse parsers. With a job description, it lists frequent words from the post that your resume does or does not contain. Only add keywords that truthfully describe your experience.</p></>} faq={[{ q: 'Is my resume uploaded?', a: 'No. The check runs in your browser and nothing is sent to us.' }, { q: 'Does a high score guarantee interviews?', a: 'No. Employers use different systems and people make the final decision. Treat the result as a checklist.' }]}><AtsChecker /></ToolShell>;
}
