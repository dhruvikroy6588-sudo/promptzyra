import Link from "next/link";
export const metadata = {
  title: "Disclaimer | Promptzyra",
  description: "Important information about AI-generated outputs, prompt examples, third-party services, and Promptzyra tools.",
  alternates: { canonical: "https://promptzyra.com/disclaimer" }
};
export default function DisclaimerPage() {
  return <main className="about-page information-page legal-page">
    <div className="section-kicker">PROMPTZYRA / INFORMATION</div>
    <h1>Website <em>disclaimer.</em></h1>
    <p>Promptzyra shares AI image prompts, tutorials, editorial information, and browser-based creative tools. The content is intended as a practical starting point and should not be treated as a guarantee of accuracy, output quality, or a specific result.</p>
    <h2>AI-generated results</h2><p>AI tools can change their behavior, models, and terms. Results may differ from examples and may contain errors or artifacts. Review all generated images and text before publishing, and check the current rules of the AI service you use.</p>
    <h2>Rights and attribution</h2><p>You are responsible for confirming that you have the rights and permissions needed to use source images and final outputs. Do not remove or conceal required attribution, copyright notices, or provenance information. Promptzyra's image tool targets supported visible Gemini watermark patterns and may not work on every image; it does not remove invisible SynthID signals.</p>
    <h2>External references</h2><p>Names and marks of third-party products belong to their respective owners. References to external tools are for identification and informational purposes and do not necessarily indicate endorsement or affiliation.</p>
    <h2>Contact</h2><p>If you notice a factual issue, contact <a href="mailto:contact@promptzyra.com">contact@promptzyra.com</a>. Read our <Link href="/terms">Terms of Use</Link> and <Link href="/privacy-policy">Privacy Policy</Link> for additional information.</p>
  </main>;
}
