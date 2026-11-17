import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'About Promptzyra: Free, Education-First AI Prompts and Tools', description: 'Promptzyra is a free, education-first AI library: reviewed prompts, photo prompts, an AI tools directory, a resume builder and browser-based tools. Learn how we work.', path: '/about' });
export default function Page() {
  return (<InfoPage title="About Promptzyra" path="/about" updated={null} lead="Promptzyra helps students, teachers and job seekers use AI tools well, with prompts that explain themselves, plain-language tool guides and free career tools that run in your browser.">
    <h2>What Promptzyra is</h2>
    <p>Promptzyra is a free website about using AI sensibly. Most people do not need another announcement about a new model. They need to know what to type, which tool suits a task, and how to check the answer before they rely on it. We collect that practical knowledge in one place and keep it readable.</p>
    <p>The site is run from India by an independent individual or small team. It is not a large company, and we would rather say so plainly than dress it up.</p>
    <h2>Our mission</h2>
    <p>Our mission is simple: make AI useful and understandable for people who are learning, teaching or looking for work, without hype and without paywalls on the core material. Every page should leave you able to do something concrete, such as write a better study plan, prepare a lesson or tidy up a resume, and should tell you honestly where AI falls short.</p>
    <h2>What we publish</h2>
    <ul>
      <li><b><Link href="/prompts">AI prompt library</Link></b>: original prompts organised by real use cases such as studying, lesson planning, writing, research and job applications. Each prompt says when to use it, how to adapt it and what to check afterwards.</li>
      <li><b><Link href="/photo-prompts">Photo prompts</Link></b>: text prompts for AI image tools, grouped by tool and subject, with guidance on using only photos you own or have permission to use.</li>
      <li><b><Link href="/ai-tools">AI tools directory</Link></b>: guides to AI tools covering who each is for, how to start, strengths, limits, pricing type and alternatives.</li>
      <li><b><Link href="/resume-builder">Resume builder</Link></b> and related tools such as the <Link href="/ats-resume-checker">ATS resume checker</Link>, <Link href="/cover-letter-builder">cover letter builder</Link> and <Link href="/study-planner">study planner</Link>. They run in your browser and your resume data is stored on your own device.</li>
      <li><b><Link href="/blog">Articles and free guides</Link></b>: longer explanations of how to use AI for learning and careers.</li>
    </ul>
    <h2>How content is made and reviewed</h2>
    <p>We write prompts and guides ourselves, and we may use AI assistants as a drafting aid. Nothing is published on the strength of AI output alone. A person reads each page, tests prompts in mainstream assistants where practical, rewrites anything unclear, and removes claims we cannot support. Pages are revisited when tools change, and verified errors are corrected. The full process is described in our <Link href="/editorial-policy">editorial policy</Link> and <Link href="/ai-policy">AI policy</Link>.</p>
    <h2>How we make money</h2>
    <p>Promptzyra is free to use. To cover hosting and writing time we show advertising, currently through Google AdSense, and we may add clearly labelled affiliate links in the future. Advertising and affiliate relationships do not decide what we list or how we describe it. See the <Link href="/advertising-disclosure">advertising disclosure</Link> for details.</p>
    <h2>What we do not do</h2>
    <ul>
      <li>We do not promise jobs, grades, income or guaranteed results.</li>
      <li>We do not sell placements in our directory or reviews.</li>
      <li>We do not copy prompts or articles from other sites.</li>
      <li>We do not ask you to create an account to use the free tools, and we do not receive your resume content.</li>
      <li>We do not give legal, medical, financial or career advice. See the <Link href="/disclaimer">disclaimer</Link>.</li>
    </ul>
    <h2>Who it is for</h2>
    <p>Students who want to study and write with AI without cutting corners on academic integrity; teachers who want help with planning, rubrics and feedback; job seekers who want a clear resume and cover letter; and anyone curious about what AI tools can and cannot do. No technical background is needed.</p>
    <h2>Privacy</h2>
    <p>We keep data collection low. Analytics and advertising cookies only run with your consent, and the resume builder works locally. Read the <Link href="/privacy-policy">privacy policy</Link> and <Link href="/cookie-policy">cookie policy</Link> for specifics.</p>
    <h2>Get in touch</h2>
    <p>Corrections, feedback and business enquiries are welcome at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or via the <Link href="/contact">contact page</Link>. You can also read <Link href="/how-it-works">how the site works</Link> or browse the <Link href="/faq">FAQ</Link>.</p>
  </InfoPage>);
}
