import Link from 'next/link';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'FAQ: Prompts, Photo Prompts, Resume Builder and Ads', description: 'Answers to common questions about Promptzyra: are prompts free, are photo prompts safe, is resume data private, how tools are chosen, ads, cookies and contact.', path: '/faq' });
const FAQ = [
  { q: 'What is Promptzyra?', a: 'Promptzyra is a free, education-first website with original AI prompts, photo prompts, an AI tools directory, a resume builder and browser-based tools for students, teachers and job seekers. It is run from India by an independent individual or small team.' },
  { q: 'Are the prompts really free?', a: 'Yes. You can copy and use prompts free of charge for personal, educational and commercial work, and you own the outputs you generate, subject to the AI tool\'s own terms. You may not resell or republish the prompt library as it is. See the terms of use.' },
  { q: 'Which AI tools do the prompts work with?', a: 'Most prompts are written to work in mainstream assistants such as ChatGPT, Claude, Gemini and Copilot, and each prompt page lists the models it was written for. Results differ between tools and over time, so adjust the wording if an answer is weak.' },
  { q: 'Why does a prompt give me a different answer than the example?', a: 'AI models are not deterministic. The same prompt can produce different results depending on the model, version, settings and earlier conversation. Treat our prompts as strong starting points, then refine them with follow-up instructions.' },
  { q: 'Can I trust what the AI tells me?', a: 'Not blindly. AI can be wrong, biased or out of date. Always verify facts, numbers and citations against reliable sources before using them. Each prompt page suggests what to check.' },
  { q: 'What are photo prompts and are they safe to use?', a: 'Photo prompts are text instructions for AI image tools. They are safe to use responsibly: use only photos you own or have permission to use, avoid creating misleading or non-consensual images of real people, and follow the tool\'s own rules. The prompts themselves do not upload anything to us.' },
  { q: 'Is my resume data private?', a: 'Yes. The resume builder runs in your browser and stores your data in your device\'s localStorage. It is not sent to our servers, and we cannot see it. Because of that, clearing your browser data deletes it, so export your resume to keep a copy.' },
  { q: 'Will the resume builder get me a job or pass ATS?', a: 'No tool can promise that. Our templates use clean, readable layouts and the ATS checker gives a rough guide, but employers and applicant tracking systems vary. Keep your resume truthful and tailor it to each role.' },
  { q: 'Do I need an account?', a: 'No. The prompts, directory, resume builder and tools work without an account. If you want the newsletter, you can subscribe with your email, which you can cancel at any time.' },
  { q: 'How do you choose and review AI tools?', a: 'Tools are included on editorial merit, using official documentation, pricing pages and our own use where possible. We do not sell placements or take payment to be listed. Prices change often, so always confirm on the official site. See the editorial policy.' },
  { q: 'How does Promptzyra make money?', a: 'Through display advertising, currently Google AdSense, which is labelled as advertising. We may add labelled affiliate links in future. Money never decides what we recommend. See the advertising disclosure.' },
  { q: 'What cookies do you use and can I decline?', a: 'We use necessary storage for your preferences, plus analytics and advertising cookies only if you accept the banner. You can decline, and the site works the same. To change your choice, clear this site\'s data in your browser. See the cookie policy.' },
  { q: 'How do I report a mistake or request removal of content?', a: 'Email us with the page address and what is wrong. We aim to reply within 2-3 business days and fix verified errors promptly. Copyright takedown requests can be sent to the same address with the subject "Takedown request".' },
  { q: 'Can students and teachers use these prompts for school?', a: 'Yes, as learning aids, within your school\'s rules. Use AI to understand, practise and improve your own work, and do not hand in AI-written text as your own where it is not allowed. See the AI policy for guidance.' },
  { q: 'How can I contact Promptzyra?', a: `Email ${CONTACT_EMAIL}. We aim to reply within 2-3 business days.` },
];
export default function Page() {
  return (<InfoPage title="Frequently Asked Questions" path="/faq" updated="17 November 2026" extraJsonLd={faqJsonLd(FAQ)} lead="Short, honest answers about how Promptzyra works. Cannot find yours? Email us.">
    {FAQ.map((f) => (<div key={f.q}><h2 style={{ fontSize: '1.2rem' }}>{f.q}</h2><p>{f.a}</p></div>))}
    <h2>More help</h2>
    <p>See <Link href="/how-it-works">how it works</Link>, the <Link href="/privacy-policy">privacy policy</Link>, <Link href="/terms">terms</Link>, <Link href="/cookie-policy">cookie policy</Link>, <Link href="/ai-policy">AI policy</Link> and <Link href="/contact">contact page</Link>.</p>
  </InfoPage>);
}
