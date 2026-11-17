import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Contact Promptzyra: Support, Corrections and Business', description: 'Email the Promptzyra team for support, corrections, privacy requests, takedown notices or business enquiries. We aim to reply within 2-3 business days.', path: '/contact' });
export default function Page() {
  return (<InfoPage title="Contact Promptzyra" path="/contact" updated={null} lead="The easiest way to reach us is email. There is no contact form to fill in and nothing to install.">
    <h2>Email</h2>
    <p><a href={`mailto:${CONTACT_EMAIL}`}><b>{CONTACT_EMAIL}</b></a></p>
    <p>We are a small team and we read every message. We aim to reply within 2-3 business days. Complex requests, such as a detailed correction or a rights complaint, can take longer, and we will tell you if so. Promptzyra is run from India, so replies may arrive on Indian working days.</p>
    <h2>What to write about</h2>
    <h3>Support and questions</h3>
    <p>If something on the site is not working, such as a template that will not download, a broken page or a tool that behaves oddly, tell us the page address, your browser and device, and what you expected to happen. A screenshot helps. We can only help with Promptzyra itself; for account or billing problems with third-party AI tools, contact that tool&rsquo;s own support.</p>
    <h3>Corrections</h3>
    <p>If a prompt, tool detail, price or guide is wrong or out of date, send the page address, the sentence in question and a source if you have one. We check and fix verified errors promptly. Our process is described in the <Link href="/editorial-policy">editorial policy</Link>.</p>
    <h3>Privacy and data requests</h3>
    <p>To ask for access to, correction of or deletion of personal data, for example removing your newsletter email, write to us with the subject line &ldquo;Privacy request&rdquo; and the email address involved. See the <Link href="/privacy-policy">privacy policy</Link> for what we hold. Resume data is stored only in your own browser, so we cannot see or delete it for you.</p>
    <h3>Copyright and takedown requests</h3>
    <p>If you believe content on Promptzyra copies your work or infringes your rights, email us with the subject &ldquo;Takedown request&rdquo; and include: the address of the page, a description of the work you own, how to contact you, a statement that you are the owner or authorised to act for them, and what you want changed. We review requests in good faith and remove or amend content where a claim is valid.</p>
    <h3>Tool listing requests</h3>
    <p>Creators may suggest a tool for review. Listing is editorial: we do not sell placements, we may decline tools we cannot verify, and a suggestion does not guarantee coverage.</p>
    <h3>Business and advertising</h3>
    <p>For partnerships or sponsorships, tell us who you are and what you propose. Any sponsored content would be labelled and would not change our reviews. See the <Link href="/advertising-disclosure">advertising disclosure</Link>.</p>
    <h2>Please do not send</h2>
    <p>Passwords, ID numbers, bank details or full resumes. We do not need them to help you. We also cannot write your resume, essays or assignments by email; the <Link href="/resume-builder">resume builder</Link> and <Link href="/prompts">prompt library</Link> are there to help you do that yourself.</p>
    <h2>Before you write</h2>
    <p>Your question may already be answered in the <Link href="/faq">FAQ</Link> or in <Link href="/how-it-works">how it works</Link>.</p>
  </InfoPage>);
}
