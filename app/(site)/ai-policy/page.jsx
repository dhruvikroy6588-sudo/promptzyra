import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'AI Policy: How We Use AI and Responsible-Use Guidance', description: 'How Promptzyra uses AI in content creation, how humans review it, its limits, and responsible-use guidance for students, teachers and job seekers, including academic integrity.', path: '/ai-policy' });
export default function Page() {
  return (<InfoPage title="AI Policy" path="/ai-policy" lead="Promptzyra is a site about AI, so we owe you clarity about how we use it ourselves and how we hope you will use it.">
    <h2>How we use AI in our work</h2>
    <p>We may use AI assistants as a helper while preparing content: brainstorming topics, outlining, suggesting examples, drafting rough text, checking grammar and testing how a prompt behaves. We use AI to test prompts because that is the only way to see how they perform.</p>
    <h2>Human review</h2>
    <p>AI is never the final author of a page. A person reviews and edits everything we publish, checks facts against reliable sources, tests prompts, removes anything unsupported and takes responsibility for the result. We do not publish unreviewed, mass-generated pages. Our process is set out in the <Link href="/editorial-policy">editorial policy</Link>.</p>
    <h2>What we do not do with AI</h2>
    <ul><li>We do not present AI-generated text as the independent opinion of a named expert.</li><li>We do not invent reviews, testimonials, statistics or sources.</li><li>We do not use AI to impersonate real people.</li><li>We do not put your resume or other tool data into AI services; the browser tools keep it on your device.</li></ul>
    <h2>Limits of AI you should know</h2>
    <ul>
      <li><b>Hallucination:</b> models can invent facts, citations and quotations that look real.</li>
      <li><b>Bias:</b> outputs can reflect stereotypes or gaps in training data.</li>
      <li><b>Out-of-date knowledge:</b> a model may not know recent events or current prices.</li>
      <li><b>Inconsistency:</b> the same prompt can give different answers on different days or in different tools.</li>
      <li><b>Privacy:</b> text you enter into an AI tool may be stored or used by that company, depending on its settings.</li>
    </ul>
    <h2>Responsible-use guidance</h2>
    <h3>For students</h3>
    <p>Use AI to understand, not to avoid understanding: ask it to explain a concept, quiz you, give feedback on your own draft or suggest a study schedule. Follow your institution&rsquo;s rules on AI, and if work must be your own, do not submit AI-written text as yours. Where AI help is allowed, say how you used it. Check every fact and reference, and never cite a source you have not opened.</p>
    <h3>For teachers</h3>
    <p>AI can help with lesson outlines, differentiated materials, rubrics and feedback drafts. Review everything for accuracy and age-appropriateness before sharing it, and avoid entering students&rsquo; names or personal details into AI tools. Be open with students about your expectations for AI use, and be cautious with AI-detection tools, which can be unreliable and unfair.</p>
    <h3>For job seekers</h3>
    <p>AI can help you phrase real achievements clearly. It must not invent experience, qualifications or numbers. Everything on your resume and in interviews must be true, and you should be able to talk about it in your own words.</p>
    <h2>Academic integrity</h2>
    <p>Our prompts are designed to support learning, such as practice questions, explanations and outlines, and not to produce assignments to hand in as your own. Academic rules differ between schools, courses and teachers. When in doubt, ask your teacher before using AI on graded work.</p>
    <h2>Questions</h2>
    <p>If you think we have used AI poorly on a page, tell us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Also see the <Link href="/disclaimer">disclaimer</Link> and <Link href="/how-it-works">how it works</Link>.</p>
  </InfoPage>);
}
