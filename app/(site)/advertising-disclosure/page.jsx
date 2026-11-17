import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Advertising Disclosure: Ads, Sponsors and Affiliates', description: 'How Promptzyra earns money: Google AdSense ads, how ads are labelled, our policy on sponsored content and affiliate links, and how to control ad personalisation.', path: '/advertising-disclosure' });
const ext = { target: '_blank', rel: 'noopener noreferrer' };
export default function Page() {
  return (<InfoPage title="Advertising Disclosure" path="/advertising-disclosure" lead="Promptzyra is free to use. This page explains how the site is funded and how we keep money separate from editorial decisions.">
    <h2>How Promptzyra earns money</h2>
    <p>The site is funded mainly by display advertising served through Google AdSense. Ad revenue helps pay for hosting, tools and the time it takes to write and review content. We do not charge for the prompts, guides or tools on the site, and we do not require an account.</p>
    <h2>How ads work and how they are labelled</h2>
    <p>Ads are chosen and delivered automatically by Google and its advertising partners, not by us. They appear in clearly separated areas and are marked as advertising by the ad network, for example with an &ldquo;Ad&rdquo; or &ldquo;Advertisement&rdquo; label. We do not disguise ads as editorial content or navigation, and we do not encourage accidental clicks. We cannot see which ads each visitor receives, we do not endorse advertised products, and the appearance of an ad is not a recommendation.</p>
    <h2>Cookies, consent and personalised ads</h2>
    <p>Ads may use cookies and similar identifiers. We ask for your consent with a banner, and if you decline, advertising storage stays denied and ads, if shown, are less personalised. You can also manage personalisation at <a href="https://adssettings.google.com" {...ext}>Google Ads Settings</a> or <a href="https://www.aboutads.info" {...ext}>aboutads.info</a>. See the <Link href="/cookie-policy">cookie policy</Link> and <Link href="/privacy-policy">privacy policy</Link>.</p>
    <h2>Sponsored content</h2>
    <p>We do not currently publish paid placements. If we ever do, the content will be clearly labelled &ldquo;Sponsored&rdquo; or &ldquo;Partner&rdquo; at the top, kept separate from our independent reviews, and subject to the same standards. We may refuse sponsors that conflict with our <Link href="/editorial-policy">editorial policy</Link>. Payment cannot buy a positive review, a ranking or a listing in the directory.</p>
    <h2>Affiliate links</h2>
    <p>We may add affiliate links in future, meaning we could earn a commission if you sign up for or buy a product through a link, at no extra cost to you. If we do, we will disclose it near the link or on the page, and affiliate relationships will not change which tools we cover, how we rate them or what we say about their limits. We will only link to products we consider relevant to our readers.</p>
    <h2>What we do not do</h2>
    <ul><li>We do not sell your personal data to advertisers.</li><li>We do not accept payment to be listed in the tools directory.</li><li>We do not run undisclosed paid reviews.</li><li>We do not place ads that mimic download buttons or site controls.</li></ul>
    <h2>Report a problem with an ad</h2>
    <p>If you see an ad that is misleading, inappropriate or harmful, send us the page address and a screenshot at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will report it to the ad network and can block categories where possible.</p>
  </InfoPage>);
}
