import { Mail, MessageSquareText, ShieldCheck } from "lucide-react";
export const metadata = {
  title: "Contact Promptzyra",
  description: "Contact Promptzyra for corrections, questions, feedback, or collaboration enquiries.",
  alternates: { canonical: "https://promptzyra.com/contact" }
};
export default function ContactPage() {
  return <main className="about-page information-page">
    <div className="section-kicker"><MessageSquareText size={15}/> GET IN TOUCH</div>
    <h1>Contact <em>Promptzyra.</em></h1>
    <p>Have a question about a prompt, spotted an error, want to suggest a guide, or need to contact us about website content? Email us with enough detail for us to understand the request.</p>
    <div className="contact-card"><span className="contact-icon"><Mail size={24}/></span><div><h2>Email Promptzyra</h2><a className="contact-address" href="mailto:contact@promptzyra.com">contact@promptzyra.com</a><p>For content corrections, include the page URL and the specific section that needs attention. For collaboration enquiries, briefly describe your proposal and preferred contact method.</p></div></div>
    <div className="about-grid contact-notes">
      <div><h2>Content corrections</h2><p>Tell us what appears inaccurate or outdated and include a source when possible.</p></div>
      <div><h2>Privacy requests</h2><p>Use the email above for questions about website data or privacy. Do not include passwords or sensitive account credentials.</p></div>
      <div><h2>Usage and permissions</h2><p>Include the URL of the relevant content and explain your concern so we can review it.</p></div>
    </div>
    <p className="about-disclaimer"><ShieldCheck size={16}/> Promptzyra does not promise an instant response time. Please avoid sending confidential or payment information by email.</p>
  </main>;
}
