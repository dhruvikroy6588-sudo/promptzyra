import Link from "next/link";
export const metadata = {
  title: "Privacy Policy | Promptzyra",
  description: "Read how Promptzyra handles website visits, analytics, content management, and browser-based image processing.",
  alternates: { canonical: "https://promptzyra.com/privacy-policy" }
};
export default function PrivacyPolicyPage() {
  return <main className="about-page information-page legal-page">
    <div className="section-kicker">PROMPTZYRA / LEGAL</div>
    <h1>Privacy <em>Policy.</em></h1>
    <p>This policy describes the main ways Promptzyra may process information when you visit the website, contact us, or use its features. The exact data handled can change as the website evolves; this page should be updated whenever new services are introduced.</p>
    <p><strong>Last reviewed: October 27, 2026.</strong></p>
    <h2>Information you provide</h2><p>If you email us, we receive the information you choose to include, such as your email address, message, and any page URL you share. Please do not send passwords, payment details, or other sensitive information.</p>
    <h2>Website analytics</h2><p>The website includes Google Analytics 4 configuration to understand general website usage. Analytics may use cookies or similar technologies and may process device, browser, page-view, and interaction information according to Google's settings and policies. Browser controls and available Google privacy controls can be used to manage some analytics activity.</p>
    <h2>Content administration and hosting</h2><p>Promptzyra uses a hosted content database and Cloudflare-based website infrastructure to deliver pages and manage published content. Administrative data and uploaded content may be processed by these service providers to operate the website. Access to the private content administration area is intended to be restricted to an authorized administrator.</p>
    <h2>Image tool processing</h2><p>The Gemini image tool on Promptzyra is designed to process selected images in your browser. The tool's image-processing code does not intentionally upload the selected image to Promptzyra's server. Your browser, extensions, or other services you use may operate independently of this tool.</p>
    <h2>Cookies and third-party services</h2><p>Third-party services such as analytics may use cookies or similar technologies. Their processing is governed by their own privacy policies. If advertising, contact forms, accounts, or additional third-party services are added, this policy should be reviewed and updated to explain their operation.</p>
    <h2>Retention and security</h2><p>We aim to limit information to what is reasonably needed to operate the site and respond to requests. No internet service can guarantee absolute security, but access controls and service-provider security features should be used to protect administrative systems.</p>
    <h2>Your choices and contact</h2><p>You can limit cookies through browser settings. To ask a privacy question or request review of information you sent us, email <a href="mailto:contact@promptzyra.com">contact@promptzyra.com</a>. We may need enough information to identify the request without collecting unnecessary sensitive data.</p>
    <p>Related pages: <Link href="/terms">Terms of Use</Link> and <Link href="/contact">Contact Promptzyra</Link>.</p>
  </main>;
}
