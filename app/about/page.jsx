import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, WandSparkles } from "lucide-react";

export const metadata = {
  title: "About Promptzyra",
  description: "Learn about Promptzyra's AI image prompt library, creator guides, and browser-based creative tools.",
  alternates: { canonical: "https://promptzyra.com/about" }
};

export default function AboutPage() {
  return <main className="about-page information-page">
    <div className="section-kicker"><Sparkles size={15}/> ABOUT PROMPTZYRA</div>
    <h1>Good prompts are a <em>starting point.</em></h1>
    <p>Promptzyra is a creative resource for people exploring AI-generated images, portraits, posters, character concepts, seasonal artwork, and short-form visual ideas. We publish copy-ready prompt examples and practical guides that help creators begin with a clear direction and then personalize the result.</p>
    <div className="about-grid">
      <div><WandSparkles size={22}/><h2>Useful prompt ideas</h2><p>Browse structured prompts that can be copied, adapted, and tested in compatible AI image tools.</p></div>
      <div><BookOpen size={22}/><h2>Practical guides</h2><p>Read step-by-step articles about prompt writing, image workflows, and creative presentation.</p></div>
      <div><Sparkles size={22}/><h2>Creator-focused tools</h2><p>Explore browser-based utilities and clear notes about their limits, privacy, and responsible use.</p></div>
    </div>
    <h2>Our approach</h2>
    <p>We aim to make each page understandable and practical. AI-generated results vary between tools, versions, and settings, so prompts should be treated as starting points rather than guaranteed recipes. We encourage creators to review outputs, check rights and platform rules, and add their own creative judgment.</p>
    <p>Questions, corrections, or suggestions are welcome. Visit our <Link href="/contact">Contact page</Link> or email <a href="mailto:contact@promptzyra.com">contact@promptzyra.com</a>.</p>
    <p><Link className="section-link" href="/">Explore the Promptzyra library <ArrowRight size={16}/></Link></p>
  </main>;
}
