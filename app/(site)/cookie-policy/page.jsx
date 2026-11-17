import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Cookie Policy: Types of Cookies and How to Control Them', description: 'What cookies and browser storage Promptzyra uses, the three categories (necessary, analytics, advertising), how the consent banner works and how to change or clear your choice.', path: '/cookie-policy' });
const ext = { target: '_blank', rel: 'noopener noreferrer' };
export default function Page() {
  return (<InfoPage title="Cookie Policy" path="/cookie-policy" lead="This page explains which cookies and similar technologies Promptzyra uses, why, and how you can control them.">
    <h2>What are cookies?</h2>
    <p>Cookies are small text files a website saves in your browser. Similar technologies, such as localStorage, also keep small pieces of information on your device. They are used to remember choices, measure traffic and show advertising. This policy covers both, and complements our <Link href="/privacy-policy">privacy policy</Link>.</p>
    <h2>Categories we use</h2>
    <h3>1. Necessary (always on)</h3>
    <p>These make the site work and remember your choices. They do not track you across sites.</p>
    <ul>
      <li><b>pz-consent</b> (localStorage): remembers whether you accepted or declined cookies, so the banner does not keep reappearing.</li>
      <li>Theme (light or dark), saved favourites and resume or tool data (localStorage): stored only on your device and never sent to us.</li>
    </ul>
    <h3>2. Analytics (only with consent)</h3>
    <p>We use Google Analytics to count visits and see which pages are useful. It sets cookies, typically beginning with <code>_ga</code>, that store a random identifier and last up to about two years unless you clear them. Without consent, analytics storage is denied.</p>
    <h3>3. Advertising (only with consent)</h3>
    <p>Google AdSense and its partners may set cookies, for example <code>__gads</code>, <code>__gpi</code> and related identifiers, to deliver, limit the frequency of and measure ads, and to personalise them if you allow it. Without consent, advertising storage and personalisation stay denied. Third-party cookies are controlled by those companies under their own policies.</p>
    <h2>How consent works</h2>
    <p>On your first visit a banner asks you to <b>Accept</b> or <b>Decline</b>. Accept allows analytics and advertising storage. Decline keeps both denied. Your answer is saved in your browser and sent to Google services as a consent signal, and the site works the same either way. We do not use necessary storage for tracking.</p>
    <h2>How to change or clear your choice</h2>
    <ul>
      <li><b>Show the banner again:</b> clear this site&rsquo;s data in your browser settings (cookies and site data for promptzyra.com). The banner will appear on your next visit.</li>
      <li><b>Delete cookies:</b> use your browser&rsquo;s privacy settings to remove cookies or block third-party cookies. Guides are available from your browser&rsquo;s help pages.</li>
      <li><b>Ad personalisation:</b> manage it at <a href="https://adssettings.google.com" {...ext}>Google Ads Settings</a> or <a href="https://www.aboutads.info" {...ext}>aboutads.info</a>.</li>
      <li><b>Analytics:</b> Google provides a <a href="https://tools.google.com/dlpage/gaoptout" {...ext}>browser add-on</a> to opt out of Google Analytics.</li>
    </ul>
    <p>Note that clearing site data also deletes any resume you saved in your browser, so export it first.</p>
    <h2>Changes</h2>
    <p>If we add or change cookies we will update this page. Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also the <Link href="/advertising-disclosure">advertising disclosure</Link>.</p>
  </InfoPage>);
}
