import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Privacy Policy: Data, Cookies and Advertising', description: 'How Promptzyra handles personal data: consent-based analytics and ads, browser-only resume storage, newsletter emails, third-party vendors and your rights under GDPR and CCPA.', path: '/privacy-policy' });
const ext = { target: '_blank', rel: 'noopener noreferrer' };
export default function Page() {
  return (<InfoPage title="Privacy Policy" path="/privacy-policy" lead="Short version: your resume stays in your browser, analytics and advertising cookies run only if you accept them, and you can ask us to delete your newsletter email at any time.">
    <p>This policy explains what information Promptzyra (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you use promptzyra.com, why we collect it and what choices you have. Promptzyra is run from India by an independent individual or small team. For privacy questions, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    <h2>Information we collect</h2>
    <h3>1. Resume builder and browser tools</h3>
    <p>Anything you type into the resume builder, cover letter builder, study planner or similar tools is stored in your browser&rsquo;s localStorage on your own device. It is not sent to our servers, and we cannot see, recover or delete it. Clearing your browser&rsquo;s site data removes it, so export a copy if you want to keep it. Saved favourites and your theme choice are stored the same way.</p>
    <h3>2. Analytics</h3>
    <p>We use Google Analytics to understand which pages are useful. It may collect page views, approximate location (city or country level), device and browser type, referring page and an identifier stored in a cookie. We load analytics in a restricted mode and only enable analytics cookies if you accept the consent banner.</p>
    <h3>3. Advertising</h3>
    <p>We show or plan to show ads through Google AdSense. Google and its partners may use cookies and similar identifiers to deliver and measure ads and, if you consent, to personalise them. See the advertising section below.</p>
    <h3>4. Newsletter</h3>
    <p>If you subscribe to our newsletter, we store your email address and the date you subscribed in a database hosted by Supabase. We use it only to send the newsletter and to manage your subscription. You can unsubscribe or ask for deletion at any time.</p>
    <h3>5. Copy counters and usage signals</h3>
    <p>When you copy a prompt, we may increase an anonymous counter for that prompt so we can see which are useful. No name, email or account is attached to it.</p>
    <h3>6. Messages you send us</h3>
    <p>If you email us, we keep the message and your email address so we can reply and keep a record of corrections and requests.</p>
    <h3>7. Server logs</h3>
    <p>Our hosting and delivery providers may log technical data such as IP address, user agent and request time for security and reliability. We do not use these logs to identify individual visitors.</p>
    <h2>Cookies and consent</h2>
    <p>The first time you visit, a banner asks you to accept or decline cookies. Your choice is stored in your browser and passed to Google services as a consent signal. If you decline, analytics and advertising storage stay denied; the site works the same either way. You can change your mind by clearing site data and cookies in your browser, which brings the banner back. Details are in the <Link href="/cookie-policy">cookie policy</Link>.</p>
    <h2>Advertising and your ad choices</h2>
    <p>Third-party vendors, including Google, use cookies to serve ads based on a user&rsquo;s prior visits to this and other websites. Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and other sites. You can opt out of personalised advertising at <a href="https://adssettings.google.com" {...ext}>Google Ads Settings</a>, or opt out of many third-party vendors&rsquo; personalised advertising at <a href="https://www.aboutads.info" {...ext}>aboutads.info</a>. You can learn how Google uses data from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" {...ext}>policies.google.com/technologies/partner-sites</a>. Opting out does not remove ads; it makes them less personalised. See our <Link href="/advertising-disclosure">advertising disclosure</Link>.</p>
    <h2>Third-party service providers</h2>
    <ul>
      <li><b>Google Analytics and Google AdSense</b>: analytics and advertising, under Google&rsquo;s privacy policy.</li>
      <li><b>Supabase</b>: database hosting for our content, newsletter list and anonymous counters.</li>
      <li><b>Cloudflare or similar hosting and delivery providers</b>: serving the site and protecting it from abuse.</li>
      <li><b>Third-party AI tools and websites</b> that we link to are not ours; they have their own privacy practices, so read them before sharing personal data.</li>
    </ul>
    <p>We do not sell your personal information.</p>
    <h2>How long we keep data</h2>
    <ul>
      <li>Newsletter emails: until you unsubscribe or ask for deletion.</li>
      <li>Emails to us: as long as needed to handle your request and keep a record of it, typically no more than two years.</li>
      <li>Analytics data: according to the retention settings in our Google Analytics account.</li>
      <li>Copy counters: kept as anonymous totals.</li>
      <li>Resume and tool data: kept only in your browser until you delete it.</li>
    </ul>
    <h2>Your rights</h2>
    <p>Depending on where you live, for example under the EU and UK GDPR, India&rsquo;s data protection law or the California Consumer Privacy Act (CCPA), you may have the right to access the personal data we hold about you, correct it, delete it, restrict or object to certain processing, withdraw consent, and receive a copy. California residents may also ask what categories of data we collect; we do not sell personal information or share it for cross-context behavioural advertising outside the advertising cookies described above, which you can decline. We will not treat you differently for exercising your rights.</p>
    <p><b>To make a request or ask for deletion,</b> email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the subject &ldquo;Privacy request&rdquo; from the address concerned. We may need to confirm it is you, and we aim to reply within 2-3 business days and complete requests within 30 days. You may also complain to your local data protection authority.</p>
    <h2>Children&rsquo;s privacy</h2>
    <p>Promptzyra is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has given us personal data, email us and we will delete it. Parents and teachers should supervise young learners who use AI tools linked from this site.</p>
    <h2>International data transfers</h2>
    <p>We are based in India, and our providers, including Google and Supabase, may process data in other countries, including the United States and the EU. Where required, those providers rely on safeguards such as standard contractual clauses. By using the site you understand your information may be processed outside your country.</p>
    <h2>Security</h2>
    <p>We use HTTPS and reputable providers and collect as little as we can. No internet service is perfectly secure, so we cannot guarantee absolute security.</p>
    <h2>Changes to this policy</h2>
    <p>We will update this page when our practices change and revise the date below. Material changes will be noted on this page. See also our <Link href="/terms">terms of use</Link>, <Link href="/cookie-policy">cookie policy</Link> and <Link href="/disclaimer">disclaimer</Link>.</p>
  </InfoPage>);
}
