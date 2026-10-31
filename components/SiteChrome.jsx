import Link from "next/link";
import { ArrowUpRight, Mail, Sparkles, WandSparkles } from "lucide-react";

export function SiteHeader() {
  return <header className="site-header">
    <div className="nav-wrap">
      <Link href="/" className="brand" aria-label="Promptzyra home"><span className="brand-mark"><Sparkles size={20}/></span><span>prompt<span className="brand-accent">zyra</span><small>CREATE WHAT'S TRENDING</small></span></Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/image-prompts">Image Gallery</Link><Link href="/#categories">Categories</Link><Link href="/image-prompt-generator">Prompt Builder</Link><Link href="/blog">Creator Guides</Link><Link href="/gemini-watermark-remover">AI Image Tool</Link>
      </nav>
      <Link className="nav-cta" href="/#trending">Browse library <ArrowUpRight size={15}/></Link>
    </div>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand-column">
          <Link href="/" className="brand footer-brand"><span className="brand-mark"><Sparkles size={18}/></span><span>prompt<span className="brand-accent">zyra</span><small>IDEAS INTO IMAGES</small></span></Link>
          <p>Creative AI prompts, practical creator guides, and simple tools to help turn an idea into a visual starting point.</p>
          <a className="footer-email" href="mailto:contact@promptzyra.com"><Mail size={15}/> contact@promptzyra.com</a>
        </div>
        <div className="footer-column"><h2>Explore</h2><Link href="/image-prompts">Image Prompt Gallery</Link><Link href="/">Prompt Library</Link><Link href="/blog">Blog & Tutorials</Link><Link href="/image-prompt-generator">AI Image Prompt Builder</Link><Link href="/gemini-watermark-remover">AI Image Tool</Link></div>
        <div className="footer-column"><h2>Information</h2><Link href="/about">About Promptzyra</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link><Link href="/disclaimer">Disclaimer</Link></div>
        <div className="footer-column"><h2>Creator notes</h2><p>AI outputs can vary by model, prompt, and settings. Review results, usage rights, and required disclosures before publishing.</p><Link className="footer-highlight-link" href="/gemini-watermark-remover"><WandSparkles size={15}/> Try the image tool <ArrowUpRight size={14}/></Link></div>
      </div>
      <div className="footer-bottom"><small>© {new Date().getFullYear()} Promptzyra. All rights reserved.</small><span>Made for curious creators.</span><div className="footer-bottom-links"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div>
    </div>
  </footer>;
}
