import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Editorial Policy: How We Create and Review Content', description: 'How Promptzyra creates, tests, reviews and updates prompts, tool guides and articles, handles corrections, discloses AI assistance and stays independent of vendors.', path: '/editorial-policy' });
export default function Page() {
  return (<InfoPage title="Editorial Policy" path="/editorial-policy" lead="This page explains how content on Promptzyra is made, checked and corrected, so you can judge how far to trust it.">
    <h2>Our standards</h2>
    <p>We aim for content that is original, accurate, useful and honest about its limits. We write for learners, teachers and job seekers, in plain English, and we avoid hype, fear and exaggerated claims. We do not promise jobs, grades or income.</p>
    <h2>How prompts are created</h2>
    <ol>
      <li><b>Pick a real task.</b> We start from something people actually need to do, such as summarising a chapter, planning a lesson or tightening a resume bullet.</li>
      <li><b>Write the prompt.</b> We write it ourselves, with clear placeholders and instructions that make the model show its reasoning or ask questions where that helps.</li>
      <li><b>Test it.</b> Where practical we run the prompt in one or more mainstream assistants, look at the answers and adjust wording that produced vague, wrong or unsafe output. Results differ between models and over time, so we do not claim identical output everywhere.</li>
      <li><b>Explain it.</b> Each prompt says when to use it, how to adapt it and what to verify afterwards.</li>
      <li><b>Review and publish.</b> A person reads the final page for clarity, accuracy and tone before it goes live.</li>
    </ol>
    <h2>How tool guides are created</h2>
    <p>For directory entries we use the vendor&rsquo;s official site, documentation and pricing page, and, where possible, our own hands-on use. We describe who the tool is for, how to start, strengths, limits and alternatives. Prices and features change, so each page should be checked against the official site. We do not copy vendor marketing text, and we do not publish claims we cannot support. If we have not tested something ourselves, we do not present it as tested.</p>
    <h2>How articles are created</h2>
    <p>Articles are researched from primary or reputable sources, written in our own words and checked for factual claims before publication. We link to sources where it helps readers verify them. We do not publish plagiarised, spun or mass-produced text.</p>
    <h2>Use of AI in our work</h2>
    <p>We may use AI assistants to brainstorm, outline, draft, check grammar or suggest examples. AI is a tool for our editors, not a replacement for them: every page is read, fact-checked and edited by a person, and the responsibility for what is published is ours. Details are in the <Link href="/ai-policy">AI policy</Link>.</p>
    <h2>Review and updates</h2>
    <p>We revisit pages when a tool changes pricing or features, when a model update breaks a prompt, when readers report problems, and during periodic reviews of popular pages. Pages show a modified date where the date matters. We remove or rewrite content that is no longer accurate.</p>
    <h2>Independence from vendors</h2>
    <p>We are not owned by, and do not take payment from, AI tool vendors to be listed or to influence a review. Tools are included on editorial merit. If we ever receive a free account or other benefit for testing, we will say so on the page. A tool&rsquo;s presence in the directory is not an endorsement.</p>
    <h2>Advertising and affiliate disclosure</h2>
    <p>The site is supported by advertising, currently Google AdSense, and may include affiliate links in future. These relationships never decide what we write, how we rank things or what we recommend. Sponsored content, if ever published, will be labelled as such. See the <Link href="/advertising-disclosure">advertising disclosure</Link>.</p>
    <h2>Corrections process</h2>
    <p>We want to hear about mistakes. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the page address and what is wrong. We aim to reply within 2-3 business days. When we confirm an error we fix it promptly, and for a significant factual correction we note the change on the page. If we disagree, we will explain why.</p>
    <h2>What we will not publish</h2>
    <ul><li>Content designed to deceive, harass or cheat, including fake credentials or plagiarism tools.</li><li>Medical, legal or financial instructions presented as professional advice.</li><li>Prompts built to produce non-consensual or deceptive images of real people.</li><li>Unverifiable claims about tools, results or earnings.</li></ul>
    <p>Related: <Link href="/about">About</Link>, <Link href="/disclaimer">Disclaimer</Link>, <Link href="/contact">Contact</Link>.</p>
  </InfoPage>);
}
