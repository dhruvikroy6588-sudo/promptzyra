import Link from "next/link";
export const metadata = {
  title: "Terms of Use | Promptzyra",
  description: "Terms for using Promptzyra's AI prompt library, articles, and browser-based creative tools.",
  alternates: { canonical: "https://promptzyra.com/terms" }
};
export default function TermsPage() {
  return <main className="about-page information-page legal-page">
    <div className="section-kicker">PROMPTZYRA / LEGAL</div>
    <h1>Terms of <em>Use.</em></h1>
    <p>By using Promptzyra, you agree to use the website responsibly and in accordance with applicable laws and the rules of any third-party services you choose to use.</p>
    <p><strong>Last reviewed: October 27, 2026.</strong></p>
    <h2>Prompts and editorial content</h2><p>Prompt examples, tutorials, and other material are provided for general creative and educational purposes. Results vary by AI model, tool version, settings, and input. We do not guarantee a particular generated result, search ranking, audience response, or commercial outcome.</p>
    <h2>Your responsibility</h2><p>You are responsible for reviewing generated content before using or publishing it. Check applicable tool terms, licenses, privacy obligations, publicity and likeness rights, copyright, platform policies, and disclosure requirements. Do not use prompts or tools to impersonate others, mislead viewers, or infringe another person's rights.</p>
    <h2>Image processing tools</h2><p>Tools are provided on an as-available basis and may not work with every file or format. Use only images you own or are authorized to edit. Preserve attribution, provenance, or watermarks when required by a license, service terms, law, or your publishing context. Always inspect processed results before sharing them.</p>
    <h2>Third-party services and links</h2><p>Promptzyra may link to external websites or use third-party hosting, analytics, and content services. We do not control those services, and their own terms and privacy policies apply to your use of them.</p>
    <h2>Availability and changes</h2><p>We may update, suspend, or remove website features or content as the site develops. Content is provided on an “as available” basis, without guarantees that every page or tool will be uninterrupted, error-free, or suitable for a specific purpose.</p>
    <h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:contact@promptzyra.com">contact@promptzyra.com</a>. This general page is not legal advice; seek qualified advice for a specific legal issue.</p>
    <p>See also our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/disclaimer">Disclaimer</Link>.</p>
  </main>;
}
