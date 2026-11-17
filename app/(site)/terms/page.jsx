import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Terms of Use: Rules for Using Promptzyra', description: 'Terms for using Promptzyra: acceptable use, prompt licensing, responsibility for AI outputs, third-party tools, no warranty, limitation of liability and governing law.', path: '/terms' });
export default function Page() {
  return (<InfoPage title="Terms of Use" path="/terms" lead="By using Promptzyra you agree to these terms. If you do not agree, please do not use the site.">
    <h2>1. About these terms</h2>
    <p>These terms apply to promptzyra.com and the free prompts, guides, directory entries and tools on it. Promptzyra is run from India by an independent individual or small team. Please read them together with the <Link href="/privacy-policy">privacy policy</Link>, <Link href="/cookie-policy">cookie policy</Link> and <Link href="/disclaimer">disclaimer</Link>.</p>
    <h2>2. Acceptable use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>break the law, or use the site to harass, deceive, defame or harm anyone;</li>
      <li>scrape, crawl or download the site in bulk, or send automated traffic at a rate that harms performance;</li>
      <li>try to bypass security, probe for vulnerabilities or interfere with how the site works;</li>
      <li>use our prompts or tools to create fraudulent resumes or credentials, impersonate someone, or produce non-consensual or deceptive images of real people;</li>
      <li>submit academic work as your own where your school, college or employer forbids AI assistance;</li>
      <li>misrepresent our content as endorsed by us.</li>
    </ul>
    <h2>3. Content and licensing</h2>
    <h3>Prompts</h3>
    <p>You may copy and use our prompts free of charge for personal, educational and commercial work. The outputs you generate with them using an AI tool are yours to use, subject to that tool&rsquo;s own terms. You may adapt prompts freely.</p>
    <h3>What you may not do</h3>
    <p>You may not resell, republish or redistribute the site&rsquo;s prompt library, guides or directory as they are, in whole or in substantial part, whether on another website, in a product, a paid bundle or a dataset, without our written permission. Short quotations with a visible link back to the source page are welcome.</p>
    <h3>Ownership</h3>
    <p>The site&rsquo;s text, structure, design, templates and code belong to us or our licensors and are protected by copyright. Trademarks and product names of third parties belong to their owners. Resumes and documents you create with our tools belong to you.</p>
    <h2>4. Your responsibility for AI outputs</h2>
    <p>AI tools can produce wrong, biased, outdated or misleading output. You are responsible for how you use what you generate: check facts, cite sources, respect copyright and privacy, and follow the rules of your school or workplace. Do not enter confidential, sensitive or other people&rsquo;s personal information into any AI tool unless you are sure its terms allow it. See the <Link href="/ai-policy">AI policy</Link>.</p>
    <h2>5. Third-party tools and links</h2>
    <p>The directory and articles link to products and websites we do not own or control. Features, prices, limits and terms change without notice, so confirm them on the official site. We are not responsible for third-party services, their availability or their content, and a listing is not a guarantee or endorsement. Some links may in future be affiliate links, which we will label.</p>
    <h2>6. Resume builder and browser tools</h2>
    <p>These tools run in your browser and save data on your device. Browser data can be cleared, so keep your own backup. We do not guarantee interviews, job offers or compatibility with every applicant tracking system.</p>
    <h2>7. Advertising</h2>
    <p>The site may display advertising. Ads are provided by third parties, and we do not control or endorse them. See the <Link href="/advertising-disclosure">advertising disclosure</Link>.</p>
    <h2>8. No warranty</h2>
    <p>The site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied, including accuracy, fitness for a particular purpose, availability or non-infringement. We may change, suspend or remove any content or tool at any time.</p>
    <h2>9. Limitation of liability</h2>
    <p>To the fullest extent permitted by law, Promptzyra and the people behind it are not liable for any indirect, incidental, special or consequential loss, or for loss of data, income, opportunities or reputation, arising from your use of the site or reliance on its content or on any AI output. Nothing in these terms limits liability that cannot lawfully be limited.</p>
    <h2>10. Termination</h2>
    <p>We may restrict access to anyone who breaks these terms. You can stop using the site at any time.</p>
    <h2>11. Changes</h2>
    <p>We may update these terms from time to time. The date below shows the latest version, and continuing to use the site after a change means you accept it.</p>
    <h2>12. Governing law</h2>
    <p>These terms are governed by the laws of India. Subject to any mandatory consumer rights where you live, courts in India will have jurisdiction over disputes.</p>
    <h2>13. Contact</h2>
    <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or the <Link href="/contact">contact page</Link>.</p>
  </InfoPage>);
}
