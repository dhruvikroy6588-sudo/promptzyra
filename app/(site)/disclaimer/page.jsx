import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Disclaimer: AI Accuracy, Advice and Third-Party Tools', description: 'Promptzyra disclaimer: AI outputs can be wrong, content is not professional advice, resumes carry no job guarantee, third-party prices change, use only photos you may use.', path: '/disclaimer' });
export default function Page() {
  return (<InfoPage title="Disclaimer" path="/disclaimer" lead="Promptzyra is an educational resource. Please read these limits before relying on anything you find or generate here.">
    <h2>General information only</h2>
    <p>Everything on Promptzyra, including prompts, guides, tool reviews, templates and articles, is published for general educational and informational purposes. We try to be accurate and keep pages current, but we make no promise that content is complete, correct or up to date.</p>
    <h2>AI outputs may be wrong</h2>
    <p>AI assistants can state false things confidently, invent sources or quotations, show bias and give different answers to the same prompt. A prompt from our library improves your chances of a useful answer but does not guarantee one. Always check facts, numbers, citations, code and calculations against reliable sources before you use or submit them. You are responsible for what you do with AI output. Read more in our <Link href="/ai-policy">AI policy</Link>.</p>
    <h2>Not professional advice</h2>
    <p>Nothing on this site is legal, medical, financial, tax, investment, mental-health or career advice, and it does not create a professional relationship. Prompts on those topics are for learning and drafting only. Consult a qualified professional before making decisions that affect your health, money, legal position or career. In an emergency, contact local emergency services.</p>
    <h2>Resumes, ATS and job outcomes</h2>
    <p>The resume builder, templates, cover letter builder and <Link href="/ats-resume-checker">ATS resume checker</Link> are aids to help you present your experience clearly. Applicant tracking systems and recruiters differ widely, so we cannot guarantee that a resume will pass any system, be read by a person, lead to an interview or result in a job. Any score from a checker is a rough guide, not a verdict. You are responsible for the truthfulness of everything on your resume.</p>
    <h2>Photo prompts</h2>
    <p>Photo prompts are text instructions for AI image tools. Use them only with photos you own or have clear permission to use, and do not use them to create misleading, harmful or non-consensual images of real people. Results vary by tool and may breach a tool&rsquo;s own rules if misused. You are responsible for complying with the tool&rsquo;s terms and applicable law.</p>
    <h2>Third-party tools, prices and links</h2>
    <p>Our directory describes tools made by other companies. Features, pricing, free-plan limits, privacy practices and availability change often and without notice, so the information on our pages may be out of date. Always confirm details on the tool&rsquo;s official website before you sign up or pay. Linking to a tool is not an endorsement or a guarantee of its quality or safety. We are not affiliated with these companies unless a page says so.</p>
    <h2>Advertising and external sites</h2>
    <p>Ads on the site are served by third parties, and we do not endorse advertised products. We are not responsible for the content or practices of external websites. See the <Link href="/advertising-disclosure">advertising disclosure</Link>.</p>
    <h2>Limitation</h2>
    <p>To the extent permitted by law, we are not liable for any loss or damage arising from reliance on the site or on AI output generated using it. See the <Link href="/terms">terms of use</Link> for the full limitation of liability.</p>
    <h2>Corrections</h2>
    <p>If you spot an error, tell us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will review it under our <Link href="/editorial-policy">editorial policy</Link>.</p>
  </InfoPage>);
}
